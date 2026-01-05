<?php
/**
 *
 * skin includer
 *
 * @author	chongmyung.park (http://byfun.com)
 */

if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가

// 이벤트명 : write_update.head.skin.php ==> write_update.head
$event_name = 'faq_'.strtolower(str_replace(".skin.php", "", $gpf_include));

// 등록된 이벤트 처리기 실행 후 반환되는 배열을 extract
gp_do_action('pre_'.$event_name);

// 스킨 경로 변경 (inc skin -> original skin)
$old_faq_skin_path = $faq_skin_path;
$faq_skin_path = GP_FAQ_SKIN_PATH;

$gpf_inc_path = dirname(__FILE__);
$gpf_current_incs = get_include_path();
set_include_path($gpf_inc_path.DS.$gpf_current_incs);

// 스킨 파일에서 path 사용시 생길 수 있는 오류 수정을 위해 출력버퍼를 가져와 보정함
ob_start();
@include $faq_skin_path."/".$gpf_include;
$out = ob_get_contents();
ob_end_clean();

$out = gp_do_filter($event_name, $out);
echo $out;

set_include_path($gpf_current_incs);
unset($gpf_current_incs);
unset($gpf_inc_path);

// 등록된 이벤트 처리기 실행 후 반환되는 배열을 extract
gp_do_action('post_'.$event_name);

unset($gpf_include);

// 스킨 경로 재설정
$faq_skin_path = $old_faq_skin_path;
?>
