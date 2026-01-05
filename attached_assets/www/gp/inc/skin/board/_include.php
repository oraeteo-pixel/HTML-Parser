<?php
/**
 * 
 * skin includer
 *
 * @author	chongmyung.park (http://byfun.com)
 */

if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가

// 이벤트명 : write_update.head.skin.php ==> write_update.head
$event_name = strtolower(str_replace(".skin.php", "", $gpf_include));

// 등록된 이벤트 처리기 실행 후 반환되는 배열을 extract
gp_do_action('pre_'.$event_name);

// 스킨 경로 변경 (inc skin -> original skin)
$old_board_skin_path = $board_skin_path;
$board_skin_path = GP_BOARD_SKIN_PATH;

// view_comment.php 를 가로채기 위한 방법
// * 조건
//   <g5>/skin/board/스킨/view.skin.php 에서 댓글 include 방식을
//   include_once("./view_comment.php"); 에서
//   include_once("view_comment.php"); 이렇게 변경해야 함
$gpf_inc_path = dirname(__FILE__);
$gpf_current_incs = get_include_path();
set_include_path($old_board_skin_path.PATH_SEPARATOR.$gpf_inc_path.PATH_SEPARATOR.$gpf_current_incs);

ob_start();
@include $board_skin_path."/".$gpf_include;
$out = ob_get_contents();
ob_end_clean();

$out = gp_do_filter($event_name, $out);
echo $out;

set_include_path($gpf_current_incs);
unset($gpf_current_incs);
unset($gpf_inc_path);

// 등록된 이벤트 처리기 실행 후 반환되는 배열을
gp_do_action('post_'.$event_name);

unset($gpf_include);

// 스킨 경로 재설정
$board_skin_path = $old_board_skin_path;
?>
