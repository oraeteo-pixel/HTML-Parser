<?php
/**
 * GPF Extend 스크립트
 *
 * GPF 에서 필요한 각종 매크로를 설정함.
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
if (!defined('_GNUBOARD_')) exit; // 개별 페이지 접근 불가

#error_reporting(E_ALL);
#ini_set('display_errors', '1');

// 다른 extend 파일들을 먼저 로드
foreach(glob(dirname(__FILE__).'/*.php') as $inc_file)
{
    if(basename($inc_file) == basename(__FILE__)) continue;
    @include_once $inc_file;
}

define('GP_VERSION', '5.1.0');
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
define('GP_APP_URL_FILE', GP_DATA_PATH.DS.'gp.app_url.php');

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
define('GP_INC_SKIN_PATH', GP_PATH.DS.'inc'.DS.'skin');
define('GP_INC_SKIN_URL', GP_URL.'/inc/skin');
define('GP_APP_URL', GP_URL.'/a');

function gp_set_skin_info($type, $skin_path, $skin_url) {
    define('GP_'.strtoupper($type).'_SKIN', basename($skin_path));
    define('GP_'.strtoupper($type).'_SKIN_PATH', $skin_path);
    define('GP_'.strtoupper($type).'_SKIN_URL', $skin_url);
    return GP_INC_SKIN_PATH.DS.$type;
}

$cwd = getcwd();

// 관리자 페이지에서는 스킨 경로를 인터셉트 하지 않음
// NO_GPF_SKIN_INTERCEPT 가 define 되어있으면 인터셉트 하지 않음
if($cwd != realpath(G5_ADMIN_PATH) &&
    $cwd == realpath(G5_BBS_PATH) &&
    !defined('NO_GPF_SKIN_INTERCEPT')) {

    $board_skin_path = gp_set_skin_info('board', $board_skin_path, $board_skin_url);
    $member_skin_path = gp_set_skin_info('member', $member_skin_path, $member_skin_url);
    $search_skin_path = gp_set_skin_info('search', $search_skin_path, $search_skin_url);
    $faq_skin_path = gp_set_skin_info('faq', $faq_skin_path, $faq_skin_url);
    $new_skin_path = gp_set_skin_info('new', $new_skin_path, $new_skin_url);
    $connect_skin_path = gp_set_skin_info('connect', $connect_skin_path, $connect_skin_url);
}

include_once GP_PATH.DS.'gnuboard.plugin.php';
?>
