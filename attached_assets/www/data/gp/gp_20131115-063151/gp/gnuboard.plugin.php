<?php
/**
 * 그누보드 플러그인 프레임워크 (Gnuboard Plugin Framwork; GPF) 메인 라이브러리
 *
 * 이 파일은 GPF에서 사용되는 라이브러리 함수들을 제공하며,
 * <g5>/gp/plugins/ 디렉토리 내부에 있는 활성화된 플러그인을 로드한다.
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

$gp_actions = array();
$gp_filters = array();

$gp_current_action = array();
$gp_current_filter = array();

if (!defined("NO_GP_PLUGINS")) {

    // 게시판일 경우 : 사이트 & 게시판 & 그룹의 활성화된 플러그인을 불러옴
    //                 이때, 게시판과 그룹에 중복 활성화된 플러그인은 게시판 설정을 우선함.
    // 게시판이 아닐 경우 : 사이트의 활성화된 플러그인을 불러옴
    $gp_plugins = array();

    if (!defined("NO_GROUP_PLUGINS") && ( $gr_id || $board['gr_id'] )) {
        $gp_plugins['GROUP'] = gp_activated_plugins(GP_SCOPE_GROUP);
    }
    if (!defined("NO_BOARD_PLUGINS") && $bo_table) {
        $gp_plugins['BOARD'] = gp_activated_plugins(GP_SCOPE_BOARD);
        if (isset($gp_plugins['GROUP']))
            $gp_plugins['GROUP'] = array_diff($gp_plugins['GROUP'], $gp_plugins['BOARD']);
    }
    if (!defined("NO_SITE_PLUGINS")) {
        $gp_plugins['SITE'] = gp_activated_plugins(GP_SCOPE_SITE);
    }

    // 플러그인 파일을 include 
    // 각 플러그인들은 plugin.php 에 gp_add_action, gp_add_filter 를 이용해 hooking 해야함
    foreach ($gp_plugins as $gp_scope => $gp_scope_plugins) {
        foreach ($gp_scope_plugins as $gp_plugin) {
            @include_once GP_PLUGIN_PATH . '/' . $gp_plugin . '/plugin.php';
        }
    }

    // GPF 시스템 플러그인 include
    foreach (glob(GP_SYSTEM_PATH . '/*', GLOB_ONLYDIR) as $dir) {
        include_once $dir . "/plugin.php";
    }

    gp_do_action('gp_plugin_loaded');
}

// 게시판 일경우, 썸네일 삭제 액션 추가
if (!empty($_REQUEST['bo_table'])) {
    gp_add_action("post_write_update.tail", "gp_delete_thumbnails");
    gp_add_action("post_delete.tail", "gp_delete_thumbnails");
    gp_add_action("post_delete_all.tail", "gp_delete_thumbnails");
}

/**
 * gp_add_filter : 필터 추가
 * 
 * @param string $name 필터명
 * @param mixed $func   필터 핸들러, 함수이름의 문자열 또는 array($obj, '핸들러') 또는 create_function() 의 함수를 넘길 수 있음
 * @param int $priority 우선순위(기본값=10), 필터들은 우선순위가 작은 순서로 먼저 적용됨
 * @param int $accepted_args 필터 핸들러에서 받을 파라미터 개수(기본값=1)
 * @access public
 * @return void
 */
function gp_add_filter($name, $func, $priority = 10, $accepted_args = 1) {
    global $gp_filters;
    $gp_filters[$name][$priority][] = array('function' => $func, 'accepted_args' => $accepted_args);
}

/**
 * gp_add_action : 액션추가
 * 
 * @param string $name 액션명
 * @param mixed $func   액션 핸들러, 함수이름의 문자열 또는 array($obj, '핸들러') 또는 create_function() 의 함수를 넘길 수 있음
 * @param int $priority 우선순위(기본값=10), 액션들은 우선순위가 작은 순서로 먼저 적용됨
 * @param int $accepted_args 액션 핸들러에서 받을 파라미터 개수(기본값=1)
 * @access public
 * @return void
 */
function gp_add_action($name, $func, $priority = 10, $accepted_args = 1) {
    global $gp_actions;
    $gp_actions[$name][$priority][] = array('function' => $func, 'accepted_args' => $accepted_args);
}

/**
 * gp_has_filter : 필터 존재 여부 검사 
 * 
 * @param string $name 필터명
 * @param mixed $func 필터 핸들러 (기본값=FALSE);
 * @access public
 * @return boolean 등록된 필터가 있으면 TRUE
 */
function gp_has_filter($name, $func = FALSE) {
    global $gp_filters;
    return gp_has_hook($gp_filters, $name, $func);
}

/**
 * gp_has_action : 액션 존재 여부 검사 
 * 
 * @param string $name 필터명
 * @param mixed $func 필터 핸들러 (기본값=FALSE);
 * @access public
 * @return boolean 등록된 액션이 있으면 TRUE
 */
function gp_has_action($name, $func = FALSE) {
    global $gp_actions;
    return gp_has_hook($gp_actions, $name, $func);
}

/**
 * gp_has_hook : 액션이나 필터가 존재하는지 검사 
 * 
 * @param mixed $pool gp_actions 또는 gp_filters 변수
 * @param mixed $name 액션명 또는 필터명
 * @param mixed $func 핸들러
 * @access protected
 * @return boolean 해당 액션 또는 필터가 존재하면 priority 반환
 */
function gp_has_hook($pool, $name, $func = false) {
    $has = !empty($pool[$name]);
    if (false === $func || false == $has)
        return $has;
    foreach ((array) array_keys($pool[$name]) as $priority) {
        if (isset($pool[$tag][$priority][$func])) {
            return $priority;
        }
    }
    return false;
}

/**
 * gp_do_filter : 필터 실행
 *
 * 필터 핸들러는 반드시, $value 에 필터를 적용한 후 다시 $value 를 리턴해야 함.
 * $value 를 리턴하면 다른 필터 핸들러에서 받아서 다시 필터를 적용할 수 있음. (chained filter)
 * 
 * @param string $name 필터명
 * @param mixed $value 필터 적용 대상 변수
 * @access public
 * @return mixed 필터가 적용된 값
 */
function gp_do_filter($name, $value) {
    global $gp_filters, $gp_current_filter;

    $args = array();

    if (!isset($gp_filters[$name]))
        return $value;
    if (empty($args))
        $args = func_get_args();

    // A 필터가 실행중에.. 다시 A필터가 호출되면.. 그냥 리턴
    if (isset($gp_current_filter[$name]))
        return $value;

    ksort($gp_filters[$name]);
    reset($gp_filters[$name]);

    // 현재 이벤트를 큐에 등록
    $gp_current_filter[] = $name;

    do {
        foreach ((array) current($gp_filters[$name]) as $the_)
            if (!is_null($the_['function'])) {
                $args[1] = $value;
                $value = call_user_func_array($the_['function'], array_slice($args, 1, (int) $the_['accepted_args']));
            }
    } while (next($gp_filters[$name]) !== false);

    // 현재 이벤트를 큐에서 빼냄
    array_pop($gp_current_filter);

    return $value;
}

/**
 * gp_do_action : 액션 실행
 * 
 * @param string $name 액션명
 * @param string $arg 액션 핸들러에 전달할 파라미터
 * @access public
 * @return void
 */
function gp_do_action($name, $arg = '') {
    global $gp_actions, $gp_current_action;

    if (!isset($gp_actions))
        $gp_actions = array();
    if (!isset($gp_actions[$name]))
        return;

    $args = array();
    if (is_array($arg) && 1 == count($arg) && isset($arg[0]) && is_object($arg[0]))
        $args[] = & $arg[0];
    else
        $args[] = $arg;
    for ($a = 2; $a < func_num_args(); $a++)
        $args[] = func_get_arg($a);

    // A 액션이 실행중에.. 다시 A액션 호출되면.. 그냥 리턴
    if (isset($gp_current_action[$name]))
        return;

    ksort($gp_actions[$name]);
    reset($gp_actions[$name]);

    // 현재 이벤트를 큐에 등록
    $gp_current_action[] = $name;

    do {
        foreach ((array) current($gp_actions[$name]) as $the_) {
            if (!is_null($the_['function']) && is_callable($the_['function'])) {
                call_user_func_array($the_['function'], array_slice($args, 0, (int) $the_['accepted_args']));
            }
        }
    } while (next($gp_actions[$name]) !== false);

    // 현재 이벤트를 큐에서 빼냄
    array_pop($gp_current_action);
}

/**
 * gp_activated_plugins : 활성화된 플러그인 목록 
 * 
 * @param string $scope 플러그인 적용 범위 (SITE, GROUP, BOARD)
 * @param string $scope_id scope가 GROUP 이면 $gr_id, BOARD 면 $bo_table
 * @access public
 * @return array 활성화된 플러그인 목록
 */
function gp_activated_plugins($scope = '', $scope_id = '') {
    if (!$scope_id)
        $scope_id = gp_scope_id($scope);
    gp_check_scope($scope, $scope_id);
    $config = gp_read_config(GP_ACTICATE_PLUGIN_CONFIG, array(), $scope, $scope_id);
    return $config;
}

/**
 * gp_is_activated : 플러그인 활성화 여부 검사
 * 
 * @param string $plugin_id 플러그인 아이디 (디렉토리명)
 * @param string $scope 플러그인 적용 범위 (SITE, GROUP, BOARD)
 * @param string $scope_id scope가 GROUP 이면 $gr_id, BOARD 면 $bo_table
 * @access public
 * @return boolean 플러그인이 활성화 된 상태면 TRUE
 */
function gp_is_activated($plugin_id, $scope = '', $scope_id = '') {
    $plugins = gp_activated_plugins($scope, $scope_id);
    return in_array($plugin_id, $plugins);
}

/**
 * gp_write_config : 플러그인 설정 저장
 * 
 * <g5>/data/gp/ 하위의 각 scope/scope_id 에 해당하는 디렉토리에 설정을 serialize 해서 저장함.
 *
 * @param string $config_file 설정파일명 (주의! 반드시 .php 파일로 저장해야 경로를 알아도 브라우져로 확인할 수 없음)
 * @param mixed $config 설정변수
 * @param string $scope 플러그인 적용 범위 (SITE, GROUP, BOARD)
 * @param string $scope_id scope가 GROUP 이면 $gr_id, BOARD 면 $bo_table
 * @access public
 * @return mixed 쓴 bytes 수 또는 FALSE
 */
function gp_write_config($config_file, $config, $scope = '', $scope_id = '') {
    $config_file_path = gp_data_path($scope, $scope_id) . '/' . $config_file;
    return _gp_write_config($config_file_path, $config);
}

/**
 * _gp_write_config : 실제로 설정을 저장하는 함수
 * 
 * @param string $file_path 설정파일의 full path
 * @param mixed $config 설정변수
 * @access protected
 * @return mixed 쓴 bytes 수 또는 FALSE
 */
function _gp_write_config($file_path, $config) {
    $fp = fopen($file_path, "w", 0606);
    $res = fwrite($fp, '<?php header("HTTP/1.0 404 Not Found");exit;?>' . (serialize($config)));
    fclose($fp);
    return $res;
}

/**
 * gp_read_config : 플러그인 설정 읽기
 * 
 * @param string $config_file 설정파일명
 * @param mixed $default_data 설정내용이 없을 경우 반환할 기본값
 * @param string $scope 플러그인 적용 범위 (SITE, GROUP, BOARD)
 * @param string $scope_id scope가 GROUP 이면 $gr_id, BOARD 면 $bo_table
 * @access public
 * @return mixed 저장되어있던 설정 내용
 */
function gp_read_config($config_file, $default_data = null, $scope = '', $scope_id = '') {
    $config_file_path = gp_data_path($scope, $scope_id) . '/' . $config_file;
    return _gp_read_config($config_file_path, $default_data);
}

/**
 * _gp_read_config : 실제로 설정을 읽어오는 함수
 * 
 * @param string $file_path 설정파일의 full path
 * @param mixed $default_data 설정내용이 없을 경우 반환할 기본값
 * @access protected
 * @return mixed 저장되어있던 설정 내용
 */
function _gp_read_config($file_path, $default_data = null) {
    if (!file_exists($file_path))
        return $default_data;
    $fp = fopen($file_path, 'r');
    $data = fread($fp, filesize($file_path));
    fclose($fp);
    if (!$data)
        return $default_data;
    $data = substr($data, 46, strlen($data) - 46);
    return @unserialize($data);
}

/**
 * gp_data_path : scope 와 scope_id 에 따른 data 경로 반환
 *
 * 디렉토리가 존재하지 않을 경우, 생성하고 경로 반환
 * 
 * @param string $scope 플러그인 적용 범위 (SITE, GROUP, BOARD)
 * @param string $scope_id scope가 GROUP 이면 $gr_id, BOARD 면 $bo_table
 * @access public
 * @return string 데이터 경로
 */
function gp_data_path($scope = '', $scope_id = '') {
    if (!$scope_id)
        $scope_id = gp_scope_id($scope);
    gp_check_scope($scope, $scope_id);

    if (!file_exists(GP_DATA_PATH)) {
        mkdir(GP_DATA_PATH);
        chmod(GP_DATA_PATH, 0707);
    }

    $scope_path = GP_DATA_PATH . '/' . strtolower($scope);

    if (!file_exists($scope_path)) {
        mkdir($scope_path);
        chmod($scope_path, 0707);
    }

    if ($scope_id) {
        $scope_path = $scope_path . '/' . $scope_id;
        if (!file_exists($scope_path)) {
            mkdir($scope_path);
            chmod($scope_path, 0707);
        }
    }

    return $scope_path;
}

/**
 * gp_plugin_url : 플러그인 URL 구하기 
 *
 * <code>
 * $plugin_rul = gp_plugin_url(__FILE__);
 * </code>
 * 
 * @param string $plugin_path 플러그인 경로
 * @access public
 * @return string 플러그인 URL
 */
function gp_plugin_url($plugin_path) {
    $skin_path = dirname(__FILE__);
    return GP_URL . str_replace($skin_path, '', dirname($plugin_path));
}

/**
 * gp_subval_asort : 연관 배열을 키를 기준으로 정렬
 *
 * <code>
 * $arr = array( array('id'=>'test1', 'name'=>'name1'),
 *               array('id'=>'test2', 'name'=>'name2'));
 * $sorted = gp_subval_assort($arr, 'id'); 
 * </code>
 *
 * @param mixed $a 연관배열
 * @param mixed $subkey 정렬 기준이 되는 key
 * @access public
 * @return array 정렬된 key
 */
function gp_subval_asort($a, $subkey) {
    $b = array();
    $c = array();
    foreach ($a as $k => $v) {
        $b[$k] = strtolower($v[$subkey]);
    }
    asort($b);
    foreach ($b as $key => $val) {
        $c[] = $a[$key];
    }
    return $c;
}

/**
 * gp_readme_files : 모든 플러그인들의 readme.txt 
 * 
 * @param string $scope 플러그인 적용 범위 (SITE, GROUP, BOARD)
 * @access public
 * @return array 모든 readme.txt 경로들
 */
function gp_readme_files($scope) {
    return _gp_plugin_files($scope, 'readme.txt');
}

/**
 * gp_plugin_files : 모든 플러그인들의 plugin.php 
 * 
 * @param string $scope 플러그인 적용 범위 (SITE, GROUP, BOARD)
 * @access public
 * @return array 모든 plugin.php 경로들
 */
function gp_plugin_files($scope) {
    return _gp_plugin_files($scope, 'plugin.php');
}

/**
 * _gp_plugin_files : 모든 플러그인들의 파일들
 * 
 * @param string $scope 플러그인 적용 범위 (SITE, GROUP, BOARD)
 * @param string $filename 리스팅할 파일명
 * @access protected 
 * @return array 모든 $filename 경로들
 */
function _gp_plugin_files($scope, $filename = 'plugin.php') {
    $files = array();
    foreach (glob(GP_PLUGIN_PATH . '/*', GLOB_ONLYDIR) as $dir) {
        $readme_file = $dir . DS . "readme.txt";
        $info = gp_plugin_info($readme_file);
        if ($scope != 'ALL' && strpos($scope, $info['Scope']) === FALSE) {
            continue;
        }
        if (file_exists($dir . DS . $filename))
            array_push($files, $dir . DS . $filename);
    }
    return $files;
}

/**
 * gp_plugin_info : readme.txt 파일에서 플러그인 정보 추출
 * 
 * @param string $file readme.txt 파일 경로 또는 readme.txt 파일 내용
 * @param boolean $is_file $file이 파일경로인가
 * @access public
 * @return array 플러그인 헤더 정보
 */
function gp_plugin_info($readme_file, $is_file = true) {
    if ($is_file === true) {
        if (!file_exists($readme_file) || !is_readable($readme_file))
            return false;
        $file_data = file_get_contents($readme_file);
        $file_data = str_replace("\r", "\n", $file_data);
        if (!$file_data)
            return false;
    }
    else
        $file_data = $readme_file;

    $headers = array(
        'Platform' => 'Platform',
        'Scope' => 'Plugin Scope',
        'Name' => 'Plugin Name',
        'PluginURI' => 'Plugin URI',
        'Version' => 'Version',
        'Description' => 'Description',
        'Author' => 'Author',
        'AuthorURI' => 'Author URI',
        'DonationURI' => 'Donation URI',
        'License' => 'Plugin License',
        'Required' => 'Required GPF Version',
        'Tested' => 'Tested up to'
    );

    foreach ($headers as $field => $regex) {
        if (preg_match('/^[ \t\/*#@]*' . preg_quote($regex, '/') . ':(.*)$/mi', $file_data, $match) && $match[1]) {
            $headers[$field] = trim(preg_replace("/\s*(?:\*\/|\?>).*/", '', $match[1]));
        } else {
            if ($field == 'Scope' || $field == 'Description' || $field == 'Platform' || $field == 'Name' || $field == 'Version' || $field == 'Author')
                return false;
            $headers[$field] = '';
        }
    }
    if ($is_file === true)
        $headers['ID'] = gp_plugin_id($readme_file);
    return $headers;
}

/**
 * gp_skin_info : 스킨 readme.txt 파일 읽기
 * 
 * @param string $readme_file 스킨리드미 파일 경로
 * @access public
 * @return void
 */
function gp_skin_info($readme_file, $is_file = true) {
    if ($is_file === true) {
        if (!file_exists($readme_file) || !is_readable($readme_file))
            return false;
        $skin_content = file_get_contents($readme_file);
        if (!$skin_content)
            return false;
        $skin_content = str_replace("\r", "\n", $skin_content);
    }
    else
        $skin_content = $reame_file;

    $skin_header = array(
        'Platform' => 'Platform',
        'SkinType' => 'Skin Type',
        'Name' => 'Skin Name',
        'SkinURI' => 'Skin URI',
        'Version' => 'Version',
        'Description' => 'Description',
        'Author' => 'Author',
        'AuthorURI' => 'Author URI',
        'DonationURI' => 'Donation URI',
        'License' => 'Skin License',
        'Required' => 'Required G5 Version',
        'Tested' => 'Tested up to'
    );
    foreach ($skin_header as $field => $regex) {
        if (preg_match('/^[ \t\/*#@]*' . preg_quote($regex, '/') . ':(.*)$/mi', $skin_content, $match) && $match[1]) {
            $skin_header[$field] = trim(preg_replace("/\s*(?:\*\/|\?>).*/", '', $match[1]));
            $skin_content = str_replace($match[0] . "\n", '', $skin_content);
        } else {
            if ($field == 'SkinType' || $field == 'Description' || $field == 'Platform' || $field == 'Name' || $field == 'Version' || $field == 'Author')
                return false;
            $skin_header[$field] = '';
        }
    }
    return $skin_header;
}

/**
 * gp_plugin_id : 플러그인 아이디 구하기
 * 
 * @param string $file 플러그인 경로
 * @access public
 * @return string 플러그인ID
 */
function gp_plugin_id($file_path) {
    return strtolower(basename(dirname($file_path)));
}

/**
 * gp_strip_slashes : 문자열/배열/오브젝트의 모든 값을 stripslash 함
 * 
 * @param mixed $input 대상 문자열/배열/오브젝트
 * @access public
 * @return mixed stripslash된 데이터
 */
function gp_strip_slashes($input) {
    if (is_array($input)) {
        $input = array_map('gp_strip_slashes', $input);
    } elseif (is_object($input)) {
        $vars = get_object_vars($input);
        foreach ($vars as $k => $v) {
            $input->{$k} = gp_strip_slashes($v);
        }
    } else {
        $input = stripslashes($input);
    }
    return $input;
}

/**
 * gp_table_exists : DB 테이블 존재 여부 검사
 * 
 * @param string $table 테이블명
 * @access public
 * @return boolean 테이블이 존재하면 TRUE
 */
function gp_table_exists($table) {
    $mysql_db = G5_MYSQL_DB;

    $res = sql_query("SHOW TABLES FROM $mysql_db");
    while ($row = mysql_fetch_array($res)) {
        if ($row[0] == $table) {
            return TRUE;
        }
    }
    return FALSE;
}

/**
 * gp_print : <ul><li> 출력 함수
 *
 * 게시판 목록 출력 시 사용되는 예제.
 * 'render' 항목의 'sl_print_이름' 은 따로 정의된 함수로 name, datetime 등의 항목을 출력하는 함수임.
 * 'condition' 항목은 $GLOBALS[컨디션명] 이 TRUE 일 경우에만 출력하도록 하는 플래그.
 * gp_print 함수 호출 시 첫번째 파라미터인 array('ul', 'class="sll_info")는
 * 출력시 가장 바깥 태그를 <ul class="sll_info">로 하라는 의미임.
 * 첫번째 파라미터를 위와같은 array가 아니라 'class="sll_info"' 로 입력해도 같은 결과임.
 *
 * <code>
 * $list_info = array(
 *    array('attr'=>'class="name"', 'render'=>'sl_print_name', 'order'=>40),
 *    array('attr'=>'class="datetime"', 'render'=>'sl_print_datetime', 'order'=>50),
 *    array('attr'=>'class="hit"', 'render'=>'sl_print_hit', 'order'=>60),
 *    array('attr'=>'class="good"', 'render'=>'sl_print_good', 'condition'=>'is_good', 'order'=>70),
 *    array('attr'=>'class="nogood"', 'render'=>'sl_print_nogood', 'condition'=>'is_nogood', 'order'=>80)
 * );
 * gp_print(array('ul', 'class="sll_info"'), $list_info, 'li', $row);
 * </code>
 *
 * array 아이템에 사용될 수 있는 키는 아래와 같다.
 * - attr : 각 항목의 속성으로 'attr'='class="date"' 일경우 <$tag class="date"> 로 출력됨
 * - render : 각 항목 출력 함수로 $row 를 파라미터로 받음
 * - text : 각 항목을 출력시 함수가 아닌 텍스트 값을 출력
 * - href : text 를 사용할 때, href 를 주면 text 를 <a> 로 감쌈
 * - href_attr : href 사용시 <a> 태그에 사용되는 속성
 * - condition : 항목을 출력하기 위한 조건 변수 
 *               condition 이 여러개일 경우 콤마(,)로 구분하여 입력하면 AND 조건으로 검사
 *               ( 'condition'=>'is_good' 일 경우, $GLOBALS['is_good'] 이 TRUE 일때만 출력됨)
 * - order : 항목 출력 순서
 *
 * <ul><li>...</li><li>..</li></ul> 이 아니라
 * <ol><li>...</li><li>..</li></ol> 로 출력하려면..
 * $wrapper 파라미터에 array('ul', 'class="list"')를, $tag 파라미터에 'li' 입력
 *
 * @param mixed $wrapper 감싸는 태그 ( eg. array('ul', 'class="list"') 또는 'class="list' )
 * @param mixed $arr 출력항목 연관배열 (사용가능 key : attr, render, text, href, href_attr, condition, order)
 * @param string $tag 항목을 감싸는 태그
 * @param string $data 항목 출력 함수에 넘겨주는 데이터
 * @access public
 * @return html HTML 출력 결과
 */
function gp_print($wrapper, $arr, $tag = 'li', $data = '') {
    if (is_array($wrapper))
        list($wtag, $wattr) = $wrapper;
    else {
        $wtag = 'ul';
        $wattr = $wrapper;
    }
    echo '<' . $wtag . ' ' . $wattr . '>' . PHP_EOL;
    for ($i = 0, $to = count($arr); $i < $to; $i++) {
        $item = $arr[$i];
        $is_break = false;
        if ($item['condition']) {
            $item_conditions = explode(",", $item['condition']);
            foreach ($item_conditions as $cond) {
                if (!$GLOBALS[$cond]) {
                    $is_break = true;
                }
            }
        }
        if ($is_break)
            continue;

        $li_attr = ($item['attr'] ? ' ' . $item['attr'] : '');
        $a_attr = ($item['href_attr'] ? ' ' . $item['href_attr'] : '');

        if (!$data)
            $data = $item;

        if (strpos($li_attr, 'class="') !== FALSE) {
            if ($i == 0)
                $li_attr = str_replace('class="', 'class="first ', $li_attr);
            else if ($i == $to - 1)
                $li_attr = str_replace('class="', 'class="last ', $li_attr);
        } else {
            if ($i == 0)
                $li_attr = ' class="first"';
            else if ($i == $to - 1)
                $li_attr = ' class="last"';
        }

        echo '<' . $tag . $li_attr . '>';
        if ($item['href'])
            echo '<a href="' . $item['href'] . '"' . $a_attr . '>' . PHP_EOL;;
        if (!empty($item['render']) && is_callable($item['render']))
            call_user_func_array($item['render'], array($data));
        else
            echo $item['text'];
        if ($item['href'])
            echo PHP_EOL . '</a>' . PHP_EOL;;
        echo '</' . $tag . '>' . PHP_EOL;
    }
    echo '</' . $wtag . '>' . PHP_EOL;
}

/**
 * gp_board_thumb : 게시판 썸네일 생성
 *
 * 게시물에 첨부된 이미지 또는 cheditor 로 첨부한 이미지에 대한 썸네일 생성
 * 
 * @param string $bo_table 게시판아이디
 * @param integer $wr_id 게시물아이디
 * @param string $wr_content 게시물 내용
 * @param array $wr_files 게시물의 첨부파일목록
 * @param integer $thumb_width 썸네일 너비
 * @param integer $thumb_height 썸네일 높이
 * @param string $mode <현재 사용되지 않음>
 * @access public
 * @return string 썸네일 경로
 */
function gp_board_thumb($bo_table, $wr_id, $wr_content, $wr_files, $thumb_width, $thumb_height, $mode = 'scale') {
    $img_quality = 95;

    // 썸네일 경로
    if ($bo_table) {
        $thumb_path = G5_PATH . '/' . G5_DATA_DIR . '/file/' . $bo_table . "/thumb";
        @mkdir($thumb_path, 0707);
        @chmod($thumb_path, 0707);
    }
    else
        return '';

    $thumb = $thumb_path . '/' . $wr_id . '_' . $thumb_width . 'x' . $thumb_height;

    $img_file = "";

    if($wr_files['count'] > 0) {
        $files = get_file($bo_table, $wr_id);
        foreach ($files as $file) {

            $filepath = G5_DATA_PATH.'/file/'.$bo_table. '/' . $file['file'];

            if (!file_exists($filepath))
                continue;
            $size = @getimagesize($filepath);
            if (!$size)
                continue;
            $img_file = $filepath;
            $img_info = $size;
            break;
        }
    }

    if (!$img_file) {

        // 마크다운의 [code] [/code] 안의 프로그램 소스중 <img> 태그를 인식하는 문제 해결
        $wr_content = preg_replace_callback('/\[code\s?([\w]{0,})\](.*?)\[\/code\]/si', create_function('$matches', 'return "";'), $wr_content);

        // 에디터 이미지 추출
        if (preg_match("/data\/cheditor\d[^\"']*\.(gif|jp[e]?g|png|bmp)/i", $wr_content, $tmp)) {
            $filepath = $file = G5_PATH . '/' . $tmp[0];
            $size = @getimagesize($filepath);
            if ($size) {
                $img_file = $filepath;
                $img_info = $size;
            }
        }

        // 에디터 이미지 추출
        if (!$img_file && preg_match("/data\/editor[^\"']*\.(gif|jp[e]?g|png|bmp)/i", $wr_content, $tmp)) {
            $filepath = $file = G5_PATH . '/' . $tmp[0];
            $size = @getimagesize($filepath);
            if ($size) {
                $img_file = $filepath;
                $img_info = $size;
            }
        }
    }

    $thumb = gp_create_thumb($img_file, $thumb, $thumb_width, $thumb_height, $mode);
    return gp_do_filter('gp_board_thumb', $thumb, $bo_table, $wr_id, $wr_content, $wr_files, $thumb_width, $thumb_height);
}

/**
 * gp_create_thumb : 썸네일 생성
 *
 * @param string $src_file 원본 이미지 파일 
 * @param integer $dst_file 생성할 썸네일 경로
 * @param integer $thumb_width 썸네일 너비
 * @param integer $thumb_height 썸네일 높이
 * @param string $mode <현재 사용되지 않음>
 * @access public
 * @return string 썸네일 경로
 */
function gp_create_thumb($src_file, $dst_file, $thumb_width, $thumb_height, $mode = 'scale', $img_quality = 95) {
    $noimg = '';

    if (!function_exists("imagecopyresampled"))
        die("GD 2.0.1 이상 버전이 설치되어 있어야 사용할 수 있는 스킨입니다.");

    if (!file_exists($src_file)) return $noimg;
    if(file_exists($dst_file)) return $dst_file;

    $img_info = @getimagesize($src_file);
    $img_width = $img_info[0];
    $img_height = $img_info[1];

    if ($img_info[2] == 1)
        $src = imagecreatefromgif($src_file);
    else if ($img_info[2] == 2)
        $src = imagecreatefromjpeg($src_file);
    else if ($img_info[2] == 3)
        $src = imagecreatefrompng($src_file);
    else
        return $noimg;

    $rate_width = $thumb_width / $img_width;
    $rate_height = $thumb_height / $img_height;

    $src_x = 0;
    $src_y = 0;
    $dst_x = 0;
    $dst_y = 0;

    $get_width = $thumb_width;
    $get_height = $thumb_height;

    if ($mode == 'scale') {
        $img_ratio = $img_width / $img_height;
        $thumb_ratio = $thumb_width / $thumb_height;

        // 이미지 너비, 높이가 썸네일 보다 작아
        if ($img_width <= $thumb_width && $img_height <= $thumb_height) {
            // 이미지는 작은 그대로... 썸네일의 가운데 위치
            $dst_x = (int) (($thumb_width - $img_width) / 2);
            $dst_y = (int) (($thumb_height - $img_height) / 2);
            $get_width = $img_width;
            $get_height = $img_width;

            // 이미지 너비가 썸네일보다 작아
        } elseif ($img_width < $thumb_width && $img_height > $thumb_height) {
            // 이미지 너비는 그대로, 높이는 썸네일 높이만큼
            $dst_x = (int) (($thumb_width - $img_width) / 2);
            $get_width = $img_width;
            $get_height = $thumb_height;
            $img_height = $thumb_height;
            // 이미지 높이가 썸네일보다 작아
        } elseif ($img_width > $thumb_width && $img_height < $thumb_height) {
            // 이미지 높이는 그대로, 너비는 썸네일 너비만큼
            $dst_y = (int) (($thumb_height - $img_height) / 2);
            $get_width = $thumb_width;
            $get_height = $img_height;
            $img_width = $thumb_width;
        } elseif ($thumb_ratio > $img_ratio) {
            // 썸네일 비율로 이미지 중앙부를 크랍하고 크랍된 이미지를 리사이즈
            $tmp_height = $img_width * $thumb_height / $thumb_width;
            $tmp_target = imagecreatetruecolor($img_width, $tmp_height);
            $tmp_y = (int) ( ($img_height - $tmp_height) / 2 );
            imagecopyresampled($tmp_target, $src, 0, 0, 0, $tmp_y, $img_width, $tmp_height, $img_width, $tmp_height);
            imagecopy($src, $tmp_target, 0, 0, 0, 0, $img_width, $tmp_height);
            $img_height = $tmp_height;
        } elseif ($thumb_ratio < $img_ratio) {
            // 썸네일 비율로 이미지 중앙부를 크랍하고 크랍된 이미지를 리사이즈
            $tmp_width = $img_height * $thumb_width / $thumb_height;
            $tmp_target = imagecreatetruecolor($tmp_width, $img_height);
            $tmp_x = (int) ( ($img_width - $tmp_width) / 2 );
            imagecopyresampled($tmp_target, $src, 0, 0, $tmp_x, 0, $tmp_width, $img_height, $tmp_width, $img_height);
            imagecopy($src, $tmp_target, 0, 0, 0, 0, $tmp_width, $img_height);
            $img_width = $tmp_width;
        }
    }

    $dst = @imagecreatetruecolor($thumb_width, $thumb_height);
    $white = @imagecolorallocate($dst, 255, 255, 255);
    @imagefilledrectangle($dst, 0, 0, $thumb_width, $thumb_height, $white);
    @imagecopyresampled($dst, $src, $dst_x, $dst_y, $src_x, $src_y, $get_width, $get_height, $img_width, $img_height);
    @imagejpeg($dst, $dst_file, $img_quality);
    @chmod($dst_file, 0606);

    if (file_exists($dst_file))
        return $dst_file;
    else
        return '';
}

/**
 * gp_to_url : 절대경로를 URL로 변환
 * 
 * @param string $path 
 * @access public
 * @return string URL
 */
function gp_to_url($path)
{
  if(strpos($path, G5_PATH) !== false) return G5_URL.str_replace(G5_PATH, "", $path);
  else return $path;
}

/**
 * gp_delete_thumbnails : 게시물 썸네일 삭제
 *
 * write_update.php, delete.php 또는 delete_all.php 실행시 호출하면
 * 현재 게시물에 대한 썸네일들을 삭제함.
 * 
 * @access public
 * @return void
 */
function gp_delete_thumbnails() {
    global $bo_table, $wr_id, $tmp_array;

    if (!$bo_table)
        return;

    $thumb_path = G5_PATH . '/' . G5_DATA_DIR . '/file/' . $bo_table . "/thumb";
    if (!file_exists($thumb_path))
        return;

    if ($wr_id) {
        foreach (glob($thumb_path . '/' . $wr_id . '_*') as $thumb) {
            @unlink($thumb);
        }
    }

    if ($tmp_array) {
        foreach ($tmp_array as $wrid) {
            foreach (glob($thumb_path . '/' . $wrid . '_*') as $thumb) {
                @unlink($thumb);
            }
        }
    }
}

/**
 * gp_scope : 현재 URL에 적용해야할 플러그인 범주 반환
 *
 * $bo_table 이 있을 경우, GP_SCOPE_BOARD를
 * 그렇지 않고 $gr_id 가 있을 경우, GP_SCOPE_GROUP 을
 * 그렇지 않을 경우 GP_SCOPE_SITE 반환
 * 
 * @access public
 * @return string 플러그인적용범주 반환
 */
function gp_scope() {
    if (defined("GP_IS_BOARD"))
        return GP_SCOPE_BOARD;
    else if (defined("GP_IS_GROUP"))
        return GP_SCOPE_GROUP;
    return GP_SCOPE_SITE;
}

/**
 * gp_scope_id : 주어진 범주에 맞는 ID 반환
 *
 * GP_SCOPE_BOARD 일 경우, $bo_table
 * GP_SCOPE_GROUP 일 경우, $gr_id
 * GP_SCOPE_SITE 일 경우 '' 반환
 * 
 * @param string $scope GP_SCOPE_BOARD, GP_SCOPE_GROUP, GP_SCOPE_SITE 중 하나
 * @access public
 * @return string 플러그인 범주 ID 반환
 */
function gp_scope_id($scope = GP_SCOPE_BOARD) {
    if ($scope == GP_SCOPE_BOARD)
        return $_REQUEST['bo_table'];
    else if ($scope == GP_SCOPE_GROUP) {
        if ($_REQUEST['gr_id'])
            return $_REQUEST['gr_id'];
        else
            return $GLOBALS['board']['gr_id'];
    }
    else
        return '';
}

/**
 * gp_check_scope : 플러그인 적용 범주가 맞는지 확인
 * 
 * @param string $scope GP_SCOPE_BOARD, GP_SCOPE_GROUP, GP_SCOPE_SITE 중 하나
 * @param mixed $scope_id $bo_table 또는 $gr_id 
 * @access public
 * @return boolean 플러그인 적용 범주와 ID가 적절할 경우 TRUE
 */
function gp_check_scope($scope, $scope_id) {
    if (!in_array($scope, array(GP_SCOPE_BOARD, GP_SCOPE_GROUP, GP_SCOPE_SITE))) {
        gp_die('GPF : $scope 는 "' . GP_SCOPE_BOARD . '", "' . GP_SCOPE_GROUP . '", "' . GP_SCOPE_SITE . '" 중 하나여야 합니다 (' . $scope . ')');
    }
    if (($scope == GP_SCOPE_BOARD || $scope == GP_SCOPE_GROUP) && !$scope_id) {
        gp_die('GPF : scope 가 "' . $scope . '" 일경우 $scope_id 는 필수입니다.');
    }
}

/**
 * gp_uparam : 플러그인 적용 범주에 따른 URL 파라미터 결정
 *
 * GPF 관리자 페이지에서 주로 사용하기 위한 함수로,
 * URL 파라미터에 bo_table 이 넘어왔을 경우, 이를 다시 URL 파라미터에 붙여서 쿼리 생성
 * gr_id 가 넘어왔을 경우에는, gr_id 를 쿼리에 붙여서 반환
 * 
 * @param boolean $no_question_mark 파라미터 앞에 ? 를 붙이지 않을지 여부
 * @access public
 * @return string URL 파라미터
 */
function gp_uparam($no_question_mark = false) {
    $q = ($no_question_mark ? '' : '?');
    if ($_REQUEST['bo_table'])
        return $q . 'bo_table=' . $_REQUEST['bo_table'];
    else if ($_REQUEST['gr_id'])
        return $q . 'gr_id=' . $_REQUEST['gr_id'];
    else
        return '';
}

/**
 * gp_url : 플러그인 범주를 적용한 URL 생성
 * 
 * @param string $page 기본 URL 
 * @param string $scope 플러그인 적용 범주
 * @param mixed $no_question_mark 파라미터 앞에 ? 를 붙이지 않을지 여부
 * @param string $plugin_id 플러그인 아이디 (이 값이 있을 경우, 쿼리 뒤에 #플러그인아이디 를 더함)
 * @access public
 * @return string URL
 */
function gp_url($page, $scope = '', $no_question_mark = false, $plugin_id = '') {
    $q = ($no_question_mark ? '' : '?');
    $hash = ($plugin_id ? '#' . $plugin_id : '');
    if ($scope == GP_SCOPE_BOARD)
        return $page . $q . 'bo_table=' . $GLOBALS['bo_table'] . $hash;
    else if ($scope == GP_SCOPE_GROUP) {
        $gr_id = ($_REQUEST['gr_id'] ? $_REQUEST['gr_id'] : $GLOBALS['board']['gr_id']);
        return $page . $q . 'gr_id=' . $gr_id . $hash;
    }
    else
        return $page . $q . $hash;
}


/**
 * gp_http_post : 주어진 URL로 데이터를 submit하고 결과를 반환
 * 
 * @param string $url POST할 URL
 * @param string $vars POST할 값을 담은 연관배열
 * @access public
 * @return array array(HTTP응답코드, HTTP응답헤더, HTTP바디)
 */
function gp_http_post($url, $vars = array()) {
    include_once GP_ADMIN_PATH . DS . 'lib'.DS.'class.snoopy.php';
    $snoopy = new Snoopy();
    $snoopy->submit($url, $vars);
    return array($snoopy->status, $snoop->headers, $snoopy->results);
}

/**
 * gp_http_get : 주어진 URL에 대한 GET 결과
 * 
 * @param string $url 대상 URL
 * @access public
 * @return array array(HTTP응답코드, HTTP응답헤더, HTTP바디)
 */
function gp_http_get($url) {
    include_once GP_ADMIN_PATH . DS . 'lib'.DS.'class.snoopy.php';
    $snoopy = new Snoopy();
    $snoopy->fetch($url);
    return array($snoopy->status, $snoop->headers, $snoopy->results);
}

/**
 * gp_http_download : URL 로부터 파일 다운로드하여 저장
 *
 * 주의! 현재 HTTPS 는 지원하지 않음
 * 
 * @param string $url 원격지 파일 경로 URL
 * @param string $filepath 다운로드 파일 저장 경로
 * @access public
 * @return array array(HTTP응답코드, HTTP응답헤더, 파일이 저장되었을 경우 TRUE)
 */
function gp_http_download($url, $filepath) {
    include_once GP_ADMIN_PATH . DS . 'lib'.DS.'class.snoopy.php';
    $snoopy = new Snoopy();
    $snoopy->fetch($url, $filepath);
    return array($snoopy->status, $snoop->headers, $snoopy->results, file_exists($filepath));
}

/**
 * gpa_api_url : 러블리어스 API URL 
 * 
 * @param string $action 요청액션
 * @param array $params 전달파라미터
 * @access public
 * @return string API URL 
 */
function gp_api_url($action, $params = array()) {
    $api_url = 'http://lovelyus.net/api/gpf';
    $gpf_api_key = _gp_read_config(GP_API_KEY_FILE, $default_data = '');
    //if(!$gpf_api_key) return false;

    $basic_info = array('hostname' => GP_HOST,
        'platform_gp' => GP_PLATFORM,
        'platform_gb' => GB_PLATFORM,
        'gpf_version' => GP_VERSION,
        'gpf_api_key' => $gpf_api_key);
    $query_array = array();
    $params = array_merge($basic_info, $params);
    foreach ($params as $key => $value) {
        array_push($query_array, $key . '=' . urlencode($value));
    }

    return $api_url . '/' . $action . '?' . implode('&', $query_array);
}

/**
 * gp_die : die 래퍼
 * 
 * @param string $msg 출력 메시지
 * @param boolean $print_trace 디버그 정보 출력 여부
 * @access public
 * @return void
 */
function gp_die($msg, $print_trace = true) {
    ?>
    <meta http-equiv="content-type" content="text/html; charset=<?php echo $GLOBALS['g5']['charset']; ?>">
    <?php echo $msg; ?>

    <?php
    if ($print_trace) {
        $trace = debug_backtrace();
        echo '<br/><br/><textarea style="width:98%;height:400px;border:1px solid #eee;">' . PHP_EOL;
        print_r($trace);
        echo '</textarea>';
    }
    exit;
}

/**
 * gp_alert : 그누보드 alert 래퍼
 * 
 * AJAX 일 경우, json 으로 alert
 * 아닐 경우, 그누보드의 alert() 사용
 *
 * @param string $msg 출력 메시지
 * @param string $url 리다이렉트 URL
 * @access public
 * @return void
 */
function gp_alert($msg = '', $url = '') {
    if (TRUE !== GP_AJAXING)
        alert($msg, $url);
    else
        die(json_encode(array('code' => -1, 'msg' => $msg)));
}

/**
 * gp_dbg : 디버깅 메시지 출력
 *
 * 개발용 디버그 출력 함수
 * 
 * @param string $msg 출력 메시지
 * @access public
 * @return void
 */
function gp_dbg($msg) {
    if (is_array($msg) || is_object($msg)) {
        echo '<textarea style="margin:10px auto;width:98%;height:200px">';
        var_dump($msg);
        echo '</textarea>';
    }
    else
        echo '==> ' . $msg . '<br/>';
}
?>
