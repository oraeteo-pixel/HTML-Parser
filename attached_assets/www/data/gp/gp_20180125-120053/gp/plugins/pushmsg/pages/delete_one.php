<?php
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

if(empty($pid)) gp_alert('알리미 : 잘못된 요청입니다.');

sql_query("DELETE FROM gpf_pushmsg WHERE receiver = '{$member['mb_id']}' AND id = '$pid' ");

goto_url('do.php?id='.$plugin_id.'&act=psm_list&read='.$read.'&page='.$page);
?>
