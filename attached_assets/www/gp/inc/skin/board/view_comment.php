<?php
/**
 * 
 * view_comment.php 를 가로챔
 *
 */
 
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

// 스킨 경로를 <gpf>/inc/skin 으로 변경
//$board_skin_path = GP_INC_SKIN_PATH;

$old_board_skin_path = $board_skin_path;
$board_skin_path = GP_BOARD_SKIN_PATH;

$gpf_inc_path = dirname(__FILE__);
$gpf_current_incs = get_include_path();
set_include_path($old_board_skin_path.PATH_SEPARATOR.$gpf_inc_path.PATH_SEPARATOR.$gpf_current_incs);

// 스킨 파일에서 path 사용시 생길 수 있는 오류 수정을 위해 출력버퍼를 가져와 보정함
ob_start();
include_once G5_BBS_PATH."/view_comment.php";
$out = ob_get_contents();
ob_clean();

if($out) {
	$out = str_replace(GP_INC_SKIN_URL, GP_BOARD_SKIN_URL, $out);
	echo str_replace(GP_INC_SKIN_PATH, GP_BOARD_SKIN_PATH, $out);
}

set_include_path($gpf_current_incs);
unset($gpf_current_incs);
unset($gpf_inc_path);
unset($out);

// 스킨 경로를 다시 원래 스킨으로 돌려놓음
//$board_skin_path = GP_SKIN_PATH;
$board_skin_path = $old_board_skin_path;
?>
