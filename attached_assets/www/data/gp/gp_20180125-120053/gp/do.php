<?php
/**
 *  플러그인 독립 실행 페이지
 *
 * 플러그인에서 px_<액션명> 으로 action 을 추가하고,
 * 이 페이지를 do.php?id=<PLUGIN_ID>&act=<ACTION_NAME>으로 호출하면
 * 플러그인의 독립적인 페이지 실행을 구현할 수 있습니다.
 *
 * 이때, layout=1 파라미터를 같이 넘기면, 
 * 그누보드 디렉토리의 head.php, tail.php 가 include 됩니다.
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 **/
include_once "_common.php";

if(!$id || !$act) gp_alert('DO : 잘못된 접근');

$plugin_files = gp_readme_files('ALL');

// 스코프에 따라 설정 저장 경로가 달라짐
$gp_scope = ($scope ? $scope : gp_scope() );

if($layout) include_once G5_PATH.'/head.php';

$gp_act = 'px_'.$act;

if(!gp_has_action($gp_act)) {
	gp_alert('DO : 요청 처리 루틴이 존재하지 않습니다.');
}

gp_do_action($gp_act);

if($layout) include_once G5_PATH.'/tail.php';
?>
