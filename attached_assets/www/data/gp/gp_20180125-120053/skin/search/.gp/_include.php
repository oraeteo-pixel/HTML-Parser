<?
/**
 * 
 * skin includer
 *
 * @author	chongmyung.park (http://byfun.com)
 */

if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가


// 이벤트명 : write_update.head.skin.php ==> WRITE_UPDATE.HEAD
$event_name = strtolower(str_replace(".skin.php", "", $gpf_include));

// 등록된 이벤트 처리기 실행 후 반환되는 배열을 extract
gp_do_action('pre_'.$event_name);

// 스킨 경로 변경
$config['cf_search_skin'] = GP_SEARCH_SKIN;

$search_skin_path = G5_PATH.'/'.G5_SKIN_DIR.'/search/'.GP_SEARCH_SKIN;
$search_skin_url = G5_URL.'/'.G5_SKIN_DIR.'/search/'.GP_SEARCH_SKIN;

// 스킨 파일에서 path 사용시 생길 수 있는 오류 수정을 위해 출력버퍼를 가져와 보정함
@include $search_skin_path."/".$gpf_include;

// 등록된 이벤트 처리기 실행 후 반환되는 배열을 extract
gp_do_action('post_'.$event_name);

unset($gpf_include);

// 스킨 경로 재설정
$config['cf_search_skin'] = GP_INTERCEPT_SKIN;
$search_skin_path = GP_PATH."/inc/skin/".GP_INTERCEPT_SKIN;
$search_skin_url = GP_URL."/inc/skin/".GP_INTERCEPT_SKIN;
?>
