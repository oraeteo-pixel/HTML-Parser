<?php
/**
 * 업그레이드 클래스
 *
 * 플러그인/코어 업데이트 클래스는 이 클래스를 상속해서 구현함.
 * 업그레이드를 위한 G5파일메니저와 유틸리티 함수들 포함.
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */

if (!defined("_GNUBOARD_"))
    exit; // 개별 페이지 접근 불가 

/**
 * GPUpgrader 
 * 
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com> 
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */

class GPUpgrader {

    /**
     * file download path (<g5>/data/gp/downloaded)
     *
     * @var string
     * */
    var $down_path;

    /**
     * associative array for api query
     *
     * @var array
     * */
    var $basic_info;

    /**
     *
     * @var boolean
     */
    var $has_error = false;
    
    /**
     * gnuboard file manager
     *
     * @var string
     * */
    var $fs;
    var $g5_remote_path;
    var $backurl;

    /**
     * __construct 
     * 
     * @access protected
     * @return void
     */
    function __construct() {
        $this->backurl = $GLOBALS['backurl'];
        $this->basic_info = array();
        $this->down_path = GP_DATA_PATH . DS . 'downloaded';
        @mkdir($this->down_path, 0707);
        @chmod($this->down_path, 0707);
    }

    /**
     * load_filemanager 
     *
     * FTP기반 G5 파일 매니저 설정
     * 호스트명,사용자명,패스워드,그누보드경로 등이 맞지 않을 경우 * alert()
     * 
     * @access public
     * @return void
     */
    function load_filemanager() {
        global $hostname, $port, $username, $password, $g5_remote_path, $connection_type, $public_key, $private_key, $backurl;
        if ($this->fs)
            return $this->fs;

        $args = compact('hostname', 'username', 'password', 'g5_remote_path', 'port', 'connection_type', 'public_key', 'private_key');
        $method = gp_get_fs_method($args);
        //$this->flush('파일시스템 : ' . strtoupper($method).'<br/>'); 

        if ($method != 'direct' && !$hostname) {
            goto_url('connection_info.php?url=updater.php&' . http_build_query($_REQUEST));
            exit;
        }

        $this->fs = gp_get_filesystem($args);
        if (!$this->fs)
            alert('파일 시스템을 불러오지 못했습니다.');

        if ($method != 'direct') {
            $login_path = $this->fs->cwd();
            $changed = $this->fs->chdir($g5_remote_path);
            $files = $this->fs->dirlist();
            if (!$changed || empty($files) || !isset($files['config.php']) || !isset($files[GP_DIR])) {
                alert('그누보드 설치 위치가 정확하지 않습니다.\n로그인 위치 : ' . $login_path, $backurl);
            }
            $this->g5_remote_path = untrailingslashit($this->fs->cwd());
        }
        else
            $this->g5_remote_path = G5_PATH;

        return $this->fs;
    }

    /**
     * setNoOBHeader 
     *
     * 업그레이드 시, Output Buffer를 사용하지 않는 출력을 위한 헤더 설정
     * 
     * @access public
     * @return void
     */
    function setNoOBHeader() {
        ini_set('output_buffering', 'off');
        ini_set('zlib.output_compression', false);
        ini_set('implicit_flush', true);
        header('Content-type: text/html');
        header('Cache-Control: no-cache');
    }

    /**
     * unzip : $target_path 디렉토리에 압축 해제
     *
     * 압축해제가 실패하는 경우
     *   1. 압축파일이나 목적지 디렉토리가 존재하지 않을 경우
     *   2. 압축파일이 빈 경우
     *
     * @param string $zip_file 압축파일 경로
     * @param string $target_path 압축을 해제할 경로
     * @access public
     * @return string|boolean 압축파일에 포함된 첫번째 파일명 또는 압축해제 실패시 FALSE
     */
    function unzip($zip_file, $target_path) {
        if (!file_exists($zip_file) || !file_exists($target_path))
            return false;
        include_once GP_ADMIN_PATH . DS . 'lib' . DS . 'class.pclzip.php';
        $archive = new PclZip($zip_file);
        if (($file_list = $archive->listContent()) == 0) {
            $this->error(' (빈파일입니다) ');
            return false;
        }
        $first_file_name = basename($file_list[0]['filename']);
        $archive->extract(PCLZIP_OPT_PATH, $target_path);
        return $first_file_name;
    }

    /**
     * flush : OB를 사용하지 않는 출력
     * 
     * @param string $msg 출력 메시지
     * @access public
     * @return void
     */
    function flush($msg) {
        echo $msg;
        while (@ob_end_flush());
        usleep(100000);
        ob_flush();
        flush();
    }

    /**
     * desc : '[완료]' 메시지 출력
     * 
     * @param string $msg 
     * @access public
     * @return void
     */
    function desc($msg) {
        $this->flush('<span style="color:blue">' . $msg . '</span>');
    }

    /**
     * error : '[실패]' 메시지 출력
     * 
     * @param string $msg 출력 메시지
     * @access public
     * @return void
     */
    function error($msg) {
        $this->has_error = true;
        $this->flush('<span style="color:red">' . $msg . '</span>');
    }

    function copy_dir($from, $to, $skip_list = array(), $do_alert = true, $cont = false) {

        if (!$this->fs)
            alert('파일시스템 관리자가 로드되지 않았습니다.');


        $abs_from = trailingslashit($from);
        $abs_to = trailingslashit($to);
        $from = trailingslashit($this->_remote_path($from));
        $to = trailingslashit($this->_remote_path($to));

        $dirlist = $this->fs->dirlist($from);

        $skip_regex = '';
        foreach ((array) $skip_list as $key => $skip_file)
            $skip_regex .= preg_quote($skip_file, '!') . '|';

        if (!empty($skip_regex))
            $skip_regex = '!(' . rtrim($skip_regex, '|') . ')$!i';

        foreach ((array) $dirlist as $filename => $fileinfo) {
            if (!empty($skip_regex))
                if (preg_match($skip_regex, $from . $filename))
                    continue;

            if ('f' == $fileinfo['type']) {
                if (!$this->fs->copy($from . $filename, $to . $filename, true, FS_CHMOD_FILE)) {
                    // If copy failed, chmod file to 0644 and try again.
                    $this->fs->chmod($to . $filename, 0644);
                    if (!$this->fs->copy($from . $filename, $to . $filename, true, FS_CHMOD_FILE))
                        if ($do_alert)
                            alert('파일 복사에 실패하였습니다 : ' . $to . $filename);
                        else {
                            echo('파일 복사에 실패하였습니다 : ' . $to . $filename);
                            if (!$cont)
                                return false;
                        }
                }
            } elseif ('d' == $fileinfo['type']) {
                if (!$this->fs->is_dir($to . $filename)) {
                    if (!$this->fs->mkdir($to . $filename, FS_CHMOD_DIR))
                        if ($do_alert)
                            alert('디렉토리 생성에 실패하였습니다 : ' . $to . $filename);
                        else {
                            echo ('디렉토리 생성에 실패하였습니다 : ' . $to . $filename);
                            if (!$cont)
                                return false;
                        }
                }
                $result = $this->copy_dir($abs_from . $filename, $abs_to . $filename, $skip_list, $do_alert, $cont);
            }
        }
        return true;
    }

    /**
     * remove_dir : 재귀적 디렉토리 삭제
     *
     * 안전한 삭제를 위해 다음의 디렉토리의 하부에만 적용
     *   - <g5>/data/gp
     *   - <g5>/gp
     *   - <g5>/adm/gp
     * 
     * @param mixed $dir 
     * @access public
     * @return void
     */
    function remove_dir($dir) {
        if (strpos(realpath($dir), realpath(GP_DATA_PATH)) !== 0 && strpos(realpath($dir), realpath(GP_PATH)) !== 0 && strpos(realpath($dir), realpath(GP_ADMIN_PATH)) !== 0)
            return;
        if (!file_exists($dir))
            return;

        $files = array_diff(scandir($dir), array('..', '.'));
        foreach ($files as $file) {
            $file_path = $dir . DS . $file;
            if (is_dir($file_path))
                $this->remove_dir($file_path);
            else {
                //echo 'Unlink : ' . $file_path.'<br/>';
                @unlink($file_path);
            }
        }
        //echo 'RmDir: ' . $dir.'<br/>';
        @rmdir($dir);
    }

    /**
     * _remote_path : 절대 경로를 원격파일 시스템의 절대 경로로 변환
     * 
     * @param string $path 
     * @access protected
     * @return void
     */
    function _remote_path($path) {
        if (!$this->g5_remote_path)
            return $path;
        $ftp_path = str_replace(DS, '/', str_replace(G5_PATH, '', $path));
        return $this->g5_remote_path . $ftp_path;
    }

}

?>
