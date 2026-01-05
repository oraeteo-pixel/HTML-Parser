<?php
/**
 * GPF Extend 스크립트
 *
 * GPF 에서 필요한 각종 매크로를 설정함.
 * G5에서 사용하는 매크로들도 설정하여, 플러그인 개발 편의를 도움.
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
if (!defined('_GNUBOARD_')) exit; // 개별 페이지 접근 불가

//error_reporting(E_ERROR);
//ini_set('display_errors', '1');

// 다른 extend 파일들을 먼저 로드
foreach(glob(dirname(__FILE__).'/*.php') as $inc_file)
{
    if(basename($inc_file) == 'gp.extend.php') continue;
    @include_once $inc_file;
}

define('GP_VERSION', '5.0.8');
define('GP', 'Gnuboard Plugins');
define('GP_HOST', $_SERVER['HTTP_HOST']);

define('GP_PLATFORM', 'GPF5');
define('GB_PLATFORM', 'G5');

define('GP_DIR', 'gp');
define('DS', DIRECTORY_SEPARATOR);

define('GP_INTERCEPT_SKIN', '.gp');
define('GP_AJAXING', !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
define('GP_DATA_PATH', G5_PATH.DS.G5_DATA_DIR.DS.'gp');
define('GP_API_KEY_FILE', GP_DATA_PATH.DS.'gp.api_key.php');

if($bo_table && $board) define('GP_IS_BOARD', TRUE);
else if($gr_id && $group) define('GP_IS_GROUP', TRUE);
else define('GP_IS_SITE', TRUE);

define('GP_SCOPE_BOARD', 'BOARD');
define('GP_SCOPE_GROUP', 'GROUP');
define('GP_SCOPE_SITE', 'SITE');

define('GP_ACTICATE_PLUGIN_CONFIG', '_activated_plugins.php');
define('GP_PATH', G5_PATH.DS.GP_DIR);
define('GP_URL', G5_URL.'/'.GP_DIR);
define('GP_ADMIN_PATH', G5_ADMIN_PATH.DS.GP_DIR);
define('GP_ADMIN_URL', G5_ADMIN_URL.'/'.GP_DIR);
define('GP_PLUGIN_PATH', GP_PATH.DS.'plugins');
define('GP_PLUGIN_URL', GP_URL.'/plugins');
define('GP_SYSTEM_PATH', GP_PATH.DS.'system');
define('GP_SYSTEM_URL', GP_URL.'/system');
define('GP_SKIN_PATH', $board_skin_path);
define('GP_SKIN_URL', G5_URL.'/skin/board/'.basename($board_skin_path));
define('GP_INC_SKIN_PATH', GP_PATH.DS.'inc'.DS.'skin');
define('GP_INC_SKIN_URL', GP_URL.'/inc/skin');

$cwd = getcwd();

// <g4>/bbs 에서 include 할때만 board_skin_path 를 intercept 함
if($cwd == realpath(G5_BBS_PATH) && !defined('NO_GPF_SKIN_INTERCEPT') )
{
	$board_skin_path = GP_INC_SKIN_PATH;
}

// 관리자 페이지에서는 인터셉트 하지 않음
if($cwd != realpath(G5_ADMIN_PATH)) {

	define('GP_MEMBER_SKIN', $config['cf_member_skin']);	// 회원 스킨 인터셉트를 위해
	define('GP_MEMBER_SKIN_PATH', G5_PATH.DS.'skin'.DS.'member'.DS.GP_MEMBER_SKIN);
	define('GP_MEMBER_SKIN_URL', G5_URL.'/skin/member/'.GP_MEMBER_SKIN);
	$config['cf_member_skin'] = GP_INTERCEPT_SKIN;
  $member_skin_path = G5_SKIN_PATH.'/member/'.GP_INTERCEPT_SKIN;

	define('GP_SEARCH_SKIN', $config['cf_search_skin']);	// 검색 스킨 인터셉트를 위해
	define('GP_SEARCH_SKIN_PATH', G5_PATH.DS.'skin'.DS.'search/'.GP_SEARCH_SKIN);
	define('GP_SEARCH_SKIN_URL', G5_URL.'/skin/search/'.GP_SEARCH_SKIN);
	$config['cf_search_skin'] = GP_INTERCEPT_SKIN;
  $search_skin_path = G5_SKIN_PATH.'/search/'.GP_INTERCEPT_SKIN;
}

include_once GP_PATH.DS.'gnuboard.plugin.php';
?>
