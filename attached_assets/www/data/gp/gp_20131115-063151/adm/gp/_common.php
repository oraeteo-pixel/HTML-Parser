<?php
$g5_path = "../.."; // common.php 의 상대 경로
define('G5_IS_ADMIN', true);
include_once("$g5_path/common.php");

include_once GP_ADMIN_PATH.DS."lib".DS."gp.admin.lib.php";

if(!$is_admin) gp_alert('관리자로 로그인 후 사용하실 수 있습니다.');

include_once(G5_ADMIN_PATH."/admin.lib.php");
$sub_menu = "717000";
?>
