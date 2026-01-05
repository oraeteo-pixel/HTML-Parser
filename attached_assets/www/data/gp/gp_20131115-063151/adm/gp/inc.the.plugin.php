<?php
/**
 * 파라미터로 넘어온 $id 를 가진 플러그인만 로드함
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


if (!$id)
    gp_alert('잘못된 접근');

$plugin_files = gp_plugin_files('ALL');

// 스코프에 따라 설정 저장 경로가 달라짐
$gp_scope = (isset($scope) ? $scope : gp_scope() );

foreach ($plugin_files as $file) {
    if ($id == gp_plugin_id($file)) {
        include_once $file;
        break;
    }
}

gp_do_action('gp_plugin_loaded');
?>
