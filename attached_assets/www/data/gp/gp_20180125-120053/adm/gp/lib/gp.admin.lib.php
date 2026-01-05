<?php
/**
 * GPF 관리자 라이브러리 함수 모음
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */

/**
 * gp_is_installed : 플러그인이 <g5>/gp/plugins 에 존재하는지 검사
 * 
 * @param string $plugin_id 플러그인 아이디 (디렉토리명)
 * @access public
 * @return boolean 플러그인이 존재하면 TRUE
 */
function gp_is_installed($plugin_id) {
    return file_exists(GP_PLUGIN_PATH . DS . $plugin_id);
}

/**
 * gp_skin_installed : 스킨이 <g5>/skin/<skin_type>/에 존재하는지 검사
 * 
 * @param string $skin_type 스킨유형
 * @param string $skin 스킨명
 * @access public
 * @return boolean 플러그인이 존재하면 TRUE
 */
function gp_skin_installed($skin_type, $skin) {
    return file_exists(G5_SKIN_PATH . DS . $skin_type . DS . $skin);
}

/**
 * gp_activate_plugin : 플러그인을 활성화 시킴
 * 
 * @param string $plugin_id 플러그인 아이디 (디렉토리명)
 * @param string $scope 플러그인 적용 범위 (SITE, GROUP, BOARD)
 * @param string $scope_id scope가 GROUP 이면 $gr_id, BOARD 면 $bo_table
 * @access public
 * @return int|boolean 쓴 bytes 수 또는 FALSE
 */
function gp_activate_plugin($plugin_id, $scope = '', $scope_id = '') {
    if (!$scope_id)
        $scope_id = gp_scope_id($scope);
    $plugins = gp_activated_plugins($scope, $scope_id);
    array_push($plugins, $plugin_id);
    $plugins = array_unique($plugins);
    return gp_write_config(GP_ACTICATE_PLUGIN_CONFIG, $plugins, $scope, $scope_id);
}

/**
 * gp_deactivate_plugin : 플러그인을 비활성화 시킴
 * 
 * @param string $plugin_id 플러그인 아이디 (디렉토리명)
 * @param string $scope 플러그인 적용 범위 (SITE, GROUP, BOARD)
 * @param string $scope_id scope가 GROUP 이면 $gr_id, BOARD 면 $bo_table
 * @access public
 * @return int|boolean 쓴 bytes 수 또는 FALSE
 */
function gp_deactivate_plugin($plugin_id, $scope = '', $scope_id = '') {
    if (!$scope_id)
        $scope_id = gp_scope_id($scope);
    $plugins = gp_activated_plugins($scope, $scope_id);
    $plugins = array_diff($plugins, array($plugin_id));
    return gp_write_config(GP_ACTICATE_PLUGIN_CONFIG, $plugins, $scope, $scope_id);
}


/**
 * gp_skins : 스킨 정보 읽기
 * 
 * @param string $skin_type 스킨유형 (board, member, latest ...)
 * @param string $target_skin_dir 스킨디렉토리명
 * @access public
 * @return array 스킨정보
 */
function gp_skins($skin_type = 'board', $target_skin_dir = '') {
    $skins = array();
    foreach (glob(G5_SKIN_PATH . DS . $skin_type . '/*', GLOB_ONLYDIR) as $dir) {
        $skin_header = gp_skin_info($dir . DS . 'readme.txt');
        if (!$skin_header)
            continue;
        array_push($skins, array('dir' => basename($dir), 'path' => $dir, 'info' => $skin_header));
        if ($target_skin_dir && $target_skin_dir == basename($dir))
            return $skin_header;
        unset($skin_header);
    }
    return $skins;
}

/**
 * gp_flush : OB없이 출력하기
 * 
 * @param string $msg 출력문자열
 * @access public
 * @return void
 */
function gp_flush($msg = '') {
    echo $msg;
    while (@ob_end_flush());
    usleep(100000);
    ob_flush();
    flush();
}

function gp_tempnam($filename = '', $dir = '') {
    if (empty($dir))
        $dir = GP_DATA_PATH . DS . 'tmp';
    @mkdir($dir, 0707);
    @chmod($dir, 0707);

    $filename = basename($filename);
    if (empty($filename))
        $filename = time();

    $filename = preg_replace('|\..*$|', '.tmp', $filename);
    $filename = $dir . gp_unique_filename($dir, $filename);
    touch($filename);
    return $filename;
}

function gp_unique_filename($dir, $filename, $unique_filename_callback = null) {

    $info = pathinfo($filename);
    $ext = !empty($info['extension']) ? '.' . $info['extension'] : '';
    $name = basename($filename, $ext);

    if ($name === $ext)
        $name = '';

    if ($unique_filename_callback && is_callable($unique_filename_callback)) {
        $filename = call_user_func($unique_filename_callback, $dir, $name, $ext);
    } else {
        $number = '';

        if ($ext && strtolower($ext) != $ext) {
            $ext2 = strtolower($ext);
            $filename2 = preg_replace('|' . preg_quote($ext) . '$|', $ext2, $filename);

            while (file_exists($dir . "/$filename") || file_exists($dir . "/$filename2")) {
                $new_number = $number + 1;
                $filename = str_replace("$number$ext", "$new_number$ext", $filename);
                $filename2 = str_replace("$number$ext2", "$new_number$ext2", $filename2);
                $number = $new_number;
            }
            return $filename2;
        }

        while (file_exists($dir . "/$filename")) {
            if ('' == "$number$ext")
                $filename = $filename . ++$number . $ext;
            else
                $filename = str_replace("$number$ext", ++$number . $ext, $filename);
        }
    }
    return $filename;
}

function gp_get_filesystem($args) {
    require_once GP_ADMIN_PATH . DS . 'lib' . DS . 'class.gp.filesystem.base.php';

    $method = gp_get_fs_method($args);

    if (!class_exists("GP_Filesystem_$method")) {
        $abstraction_file = GP_ADMIN_PATH . DS . 'lib' . DS . '/class.gp.filesystem.' . $method . '.php';
        if (!file_exists($abstraction_file))
            return false;
        require_once($abstraction_file);
    }
    $method = "GP_Filesystem_$method";
    $gp_filesystem = new $method($args);

    if (!defined('FS_CONNECT_TIMEOUT'))
        define('FS_CONNECT_TIMEOUT', 30);
    if (!defined('FS_TIMEOUT'))
        define('FS_TIMEOUT', 30);
    if (!defined('FS_CHMOD_DIR'))
        define('FS_CHMOD_DIR', 0755);
    if (!defined('FS_CHMOD_FILE'))
        define('FS_CHMOD_FILE', 0644);

    if (!$gp_filesystem->connect())
        return false;

    return $gp_filesystem;
}

function gp_get_fs_method($args, $target_path = '') {
    $method = defined('FS_METHOD') ? FS_METHOD : false;
    if (!$method && function_exists('getmyuid') && function_exists('fileowner')) {
        $temp_file_name = G5_PATH . DS . 'temp-write-test-' . time();
        $temp_handle = @fopen($temp_file_name, 'w');
        if ($temp_handle) {
            if (getmyuid() == @fileowner($temp_file_name))
                $method = 'direct';
            @fclose($temp_handle);
            @unlink($temp_file_name);
        }
    }

    if (!$method && isset($args['connection_type']) && 'ssh' == $args['connection_type'] && extension_loaded('ssh2') && function_exists('stream_get_contents'))
        $method = 'ssh2';
    if (!$method && extension_loaded('ftp'))
        $method = 'ftpext';
    if (!$method && ( extension_loaded('sockets') || function_exists('fsockopen') ))
        $method = 'ftpsockets';

    return $method;
}

function gp_get_text($str) {
    return get_text($str);
}

if (!function_exists('http_build_query')) {

    /**
     * http_build_query : for PHP4
     * 
     * @param array $query 연관배열
     * @access public
     * @return string 쿼리 
     */
    function http_build_query($query) {
        $query_array = array();
        foreach ($query as $key => $key_value) {
            $query_array[] = urlencode($key) . '=' . urlencode($key_value);
        }
        return implode('&', $query_array);
    }

}
?>
