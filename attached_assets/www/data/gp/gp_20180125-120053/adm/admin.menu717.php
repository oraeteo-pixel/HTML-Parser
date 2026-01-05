<?php
$gpf_adm_menu = array();

$menu["menu717"] = array (
    array("717000", "플러그인", G5_ADMIN_URL."/gp/index.php".gp_uparam()),
    array("", "시작", G5_ADMIN_URL."/gp/index.php".gp_uparam()),
    array("", "GPF 설정", G5_ADMIN_URL."/gp/gpf_setting.php?".gp_uparam()),
    array("", "업그레이드", G5_ADMIN_URL."/gp/gpf_upgrade.php?".gp_uparam()),
    array("", "설치확인", G5_ADMIN_URL."/gp/check_gpf.php?".gp_uparam())
);

$menu["menu717"] = gp_do_filter('gp_admin_menu', $menu["menu717"]);
?>
