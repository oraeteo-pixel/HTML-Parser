<?
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

if($is_guest) alert('권한이 없습니다.');

sql_query("DELETE FROM gpf_logintry WHERE mb_id = '{$member['mb_id']}'");
alert('로그를 정리하였습니다.');
?>
