<?php
/**
 * GPF 관리자 페이지 헤더 
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

include_once G5_ADMIN_PATH . '/admin.head.php';

$uparam = gp_uparam();

$gpa_tab_menus = array(
    array('attr' => ($gpa_page_id == 'index' ? 'class="on"' : ''), 'href' => 'index.php' . $uparam, 'text' => '시작', 'order' => 10),
    array('attr' => ($gpa_page_id == 'setting' ? 'class="on"' : ''), 'href' => 'setting.php' . $uparam, 'text' => '설정', 'order' => 20),
    array('attr' => ($gpa_page_id == 'plugins' ? 'class="on"' : ''), 'href' => 'plugins.php' . $uparam, 'text' => '플러그인', 'order' => 30),
    array('attr' => ($gpa_page_id == 'skins' ? 'class="on last"' : 'class="last"'), 'href' => 'skins.php' . $uparam, 'text' => '스킨', 'order' => 40)
);
$gpa_tab_menus = gp_do_filter('gpa_tab_menus', $gpa_tab_menus);
$gpa_tab_menus = gp_subval_asort($gpa_tab_menus, 'order');

$related_group = array();
$gp_groups = array();
$res = sql_query("SELECT gr_id, gr_subject FROM {$g5['group_table']} order by gr_subject");
while ($row = sql_fetch_array($res)) {
    if ($row['gr_id'] == $board['gr_id']) {
        $related_group = $row;
    }
    array_push($gp_groups, $row);
}

$res = sql_query("SELECT gr_id, bo_table, bo_subject FROM {$g5['board_table']} order by bo_subject");
$gp_boards = array();
$related_boards = array();
while ($row = sql_fetch_array($res)) {
    if ($row['gr_id'] == $gr_id)
        array_push($related_boards, $row);
    array_push($gp_boards, $row);
}
?>
<link rel="stylesheet" href="<?php echo GP_ADMIN_URL; ?>/css/style.css" type="text/css">

<section class="gp_admin cbox">

    <h1 class="gp_admin_head">GNUBoard Plugin Framework <span class="gp_version"><span class="gp_version_lb">Ver.</span><?php echo GP_VERSION; ?></span></h1>

    <div class="gpa_tab">
        <?php gp_print(array('ul', ''), $gpa_tab_menus); ?>
    </div>

    <div class="gp_container">

        <div class="gp_body">
