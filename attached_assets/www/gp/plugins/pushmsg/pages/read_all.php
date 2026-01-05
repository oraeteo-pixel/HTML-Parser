<?php
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

if(empty($chk_psm_id)) gp_alert('알리미 : 잘못된 요청입니다.');

$ids = implode(',', $chk_psm_id);

sql_query("UPDATE gpf_pushmsg SET checked = 1 WHERE receiver = '{$member['mb_id']}' AND id IN ( $ids )");

goto_url('do.php?id='.$plugin_id.'&act=psm_list&read='.$read.'&page='.$page);
?>
