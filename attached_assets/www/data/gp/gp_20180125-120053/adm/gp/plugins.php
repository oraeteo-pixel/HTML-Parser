<?
/**
 * GPF 관리자 > 플러그인 목록
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
include_once "_common.php";

$g5['title'] = '설치 플러그인 목록';

$gpa_page_id = str_replace('.php', '', basename(__FILE__));
include_once 'head.php';

$gp_scope = $gp_list_scope = gp_scope();
if (defined("GP_IS_GROUP")) {
    $gp_list_scope = GP_SCOPE_BOARD; // 플러그인 목록은 scope가 그룹일때도 게시판 플러그인을 보여줌
}

$plugin_info = array();
$readme_files = gp_readme_files($gp_list_scope);
foreach ($readme_files as $file) {
    $plugin_file = dirname($file) . '/plugin.php';
    $plugin_data = gp_plugin_info($file);
    if (!$plugin_data['ID'] || !$plugin_data['Name'])
        continue;
    array_push($plugin_info, $plugin_data);
}

$plugin_info = gp_subval_asort($plugin_info, 'Name');
?>
<h2>
    설치된 플러그인 
    <span class="gpa_sub_link">
        <a href="plugin_install.php<?php echo gp_uparam(); ?>">플러그인 추가</a>
    </span>
</h2>

<div class="gpa_section">
    <ul>
        <?php
        if ($bo_table) {
            echo '<li><a href="' . G5_BBS_URL . '/board.php?bo_table=' . $bo_table . '"><span class="gp_target">' . $board['bo_subject'] . '</span></a> 게시판에 사용되는 플러그인입니다. </li>' . PHP_EOL;
            echo '<li>이 게시판이 속한 <a href="' . G5_ADMIN_URL . '/board_list.php?sfl=a.gr_id&stx=' . $board['gr_id'] . '">"' . $group['gr_subject'] . '" 그룹</a>의 모든 게시판에 같은 설정을 하고 싶은 경우, <a href="plugins.php?gr_id=' . $board['gr_id'] . '">여기</a>를 클릭하세요.</li>' . PHP_EOL;
        } else if ($gr_id) {
            echo '<li><a href="' . G5_BBS_URL . '/group.php?gr_id=' . $gr_id . '"><span class="gp_target">' . $group['gr_subject'] . '</span></a> 그룹에 사용되는 플러그인입니다. </li>' . PHP_EOL;
            echo '<li>그룹과 게시판에 모두 플러그인을 활성화 할 경우, 게시판 플러그인에서 설정한 내용이 우선순위를 갖습니다.</li>' . PHP_EOL;
        } else {
            echo '<li><span class="gp_target">사이트 전체</span>에 적용되는 플러그인 목록입니다.</li>' . PHP_EOL;
        }
        ?>
        <li>사이트 전체, 혹은 다른 그룹, 게시판에 적용할 플러그인을 선택하시려면 다음 목록에서 선택하세요. 
            <div>
                대상 : 
                <select name="gpa_selector" class="gpa_selector" onchange="location.href = '?' + this.value;">
                    <option value="">사이트 전체</option>
                    <option class="head" value="">---------------</option>
                    <option class="head" value="">+ 그룹</option>
                    <option class="head" value="">---------------</option>
                    <?php
                    foreach ($gp_groups as $row) {
                        echo '<option class="item" value="gr_id=' . $row['gr_id'] . '"' . ($gr_id == $row['gr_id'] ? ' selected' : '') . '>' . $row['gr_subject'] . ' (' . $row['gr_id'] . ')</option>' . PHP_EOL;
                    }
                    ?>
                    <option class="head" value="">---------------</option>
                    <option class="head" value="">+ 게시판</option>
                    <option class="head" value="">---------------</option>
                    <?php
                    foreach ($gp_boards as $row) {
                        echo '<option class="item" value="bo_table=' . $row['bo_table'] . '"' . ($bo_table == $row['bo_table'] ? ' selected' : '') . '>   ' . $row['bo_subject'] . ' (' . $row['bo_table'] . ')</option>' . PHP_EOL;
                    }
                    ?>
                </select>
            </div>
        </li>
    </ul>
</div>

<table class="gpa_table" cellspacing="0" cellpadding="0" border="0" width="100%">
    <colgroup><col width="160px"/><col/></colgroup>
    <thead>
        <tr>
            <th style="text-align:right">플러그인</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <?php
        foreach ($plugin_info as $info) {
            $is_activated = gp_is_activated($info['ID'], $gp_scope);
            array_walk($info, create_function('&$value, $key', '$value = gp_get_text($value); if($key == "Description") $value = url_auto_link($value); '));
            ?>
            <tr>
                <th valign="top">
                    <a href="plugininfo.php?plugin=<?php echo $info['ID']; echo '&'.gp_uparam(true);?>"><span <?= ($is_activated ? 'class="activated"' : '') ?> style="color:#333"><?= $info['Name'] ?></span></a>
                    <?
                    $menus = array();
                    if (!$is_activated)
                        array_push($menus, array('href' => gp_url(GP_ADMIN_URL . '/activate.php', $gp_scope, $noqm = false) . '&id=' . $info['ID'], 'text' => '활성화', 'attr' => ''));
                    else
                        array_push($menus, array('href' => gp_url(GP_ADMIN_URL . '/deactivate.php', $gp_scope, $noqm = false) . '&id=' . $info['ID'], 'text' => '비활성화', 'attr' => ''));

                    array_push($menus, array('href' => 'javascript:if(confirm(\'플러그인 파일이 모두 삭제됩니다.\\n삭제 하시겠습니까?\')) { location.href=\'' . gp_url(GP_ADMIN_URL . '/updater.php', $gp_scope, $noqm = false) . '&utarget=plugin&md=remove&plugin=' . $info['ID'] . '&nocache=' . time() . '\';}', 'text' => '제거'));

                    $menus = gp_do_filter('gpa_menu_plugin_' . $info['ID'], $menus);
                    ?>
        <ul>
    <?
    foreach ($menus as $menu) {
        echo '<li><a href="' . $menu['href'] . '"' . $menu['attr'] . '>' . $menu['text'] . '</a></li>';
    }
    ?>
        </ul>
    </th>
    <td valign="top">
        <div class="gpa_desc">
                <?php echo $info['Description']; ?>
        </div>
        <div class="gpa_info">
            버전 : <?php echo $info['Version']; ?> 
                <?php if ($info['Author']) { ?>
                | 저자 : <?php if ($info['AuthorURI']) { ?><a href="<?php echo $info['AuthorURI']; ?>"><?php } ?>
        <?php echo $info['Author']; ?>
        <?php if ($info['AuthorURI']) { ?></a> <?php } ?>
    <?php } ?>
    <?php if ($info['PluginURI']) { ?>|  <a href="<?php echo $info['PluginURI']; ?>">플러그인사이트 방문</a><?php } ?>
    <?php if ($info['DonationURI']) { ?>|  <a href="<?php echo $info['DonationURI']; ?>">플러그인 후원하기</a><?php } ?>
        </div>
    </td>
    </tr>
<?php } ?>
<?php if (empty($plugin_info)) { ?>
    <tr>
        <td colspan="2" height="100px" align="center" valign="middle">
            플러그인이 없습니다.
        </td>
    </tr>
<?php } ?>
</tbody>
</table>
<?php
include_once 'tail.php';
?>
