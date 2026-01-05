<?php
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

if(empty($pid)) gp_alert('알리미 : 잘못된 요청입니다.');

sql_query("UPDATE gpf_pushmsg SET checked = 1 WHERE receiver = '{$member['mb_id']}' AND id = '{$pid}'");

if(mysql_error()) die( json_encode( array('code'=>-1, 'msg'=>'푸쉬 메시지를 읽음 상태로 변경하는데 실패하였습니다.') ) );


die( json_encode( array('code'=>1) ) );

?>
