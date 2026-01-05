<?php
/**
 * GPF 관리자 > 스킨 목록
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
include_once "_common.php";

$g5['title'] = '설치 스킨 목록';

$gpa_page_id = str_replace('.php', '', basename(__FILE__));

include_once 'head.php';

if (!isset($skin_type))
    $skin_type = 'board';
if (!file_exists(G5_SKIN_PATH . DS . $skin_type))
    alert('존재하지 않는 스킨 유형입니다.');

$skins = gp_skins($skin_type);
$skins = gp_subval_asort($skins, 'dir');

$skin_types = array(
    'board' => '게시판',
    'latest' => '최신글',
    'member' => '회원통합',
    'outlogin' => '아웃로그인',
    'search' => '전체검색',
    'new' => '새글',
    'poll' => '설문조사',
    'popular' => '인기검색어',
    'connect' => '현재접속자',
    'visit' => '방문자수'
);
if (!$skin_types[$skin_type] || !file_exists(G5_SKIN_PATH . DS . $skin_type))
    alert('잘못된 연결');
?>
<h2>
    설치된 스킨
    <span class="gpa_sub_link">
        <a href="skin_install.php?skin_type=<?php echo $skin_type; ?>&<?php echo gp_uparam(TRUE); ?>">스킨 추가</a>
    </span>
</h2>

<ul class="gpa_sub_menu">
    <?php foreach ($skin_types as $st => $sn) { ?>
        <li><a href="skins.php?skin_type=<?php echo $st; ?>&<?php echo gp_uparam(TRUE) ?>"<?php if ($st == $skin_type) echo ' class="on"'; ?>><?php echo $sn; ?></a></li> 
<?php } ?>
</ul>

<div class="gpa_section">
    <ul>
        <li>스킨 정보파일(readme.txt)이 존재하지 않는 스킨은 제외됩니다.</li>
    </ul>
</div>

<table class="gpa_table" cellspacing="0" cellpadding="0" border="0" width="100%">
    <colgroup><col width="160px"/><col/></colgroup>
    <thead>
        <tr>
            <th style="text-align:right">스킨</th>
            <th>설명</th>
        </tr>
    </thead>
    <tbody>
        <?php
        foreach ($skins as $skin) {
            $info = $skin['info'];
            if (!isset($info['Description']))
                $info['Description'] = '등록된 설명이 없습니다.';
            array_walk($info, create_function('&$value, $key', '$value = gp_get_text($value); if($key == "Description") $value = url_auto_link($value); '));
            ?>
            <tr>
                <th valign="top">
                    <a href="skininfo.php?skin_type=<?php echo $skin_type;?>&skin=<?php echo $skin['dir'];?><?php echo '&'.gp_uparam(true);?>"><span style="color:#222"><?php echo $info['Name']; ?></span></a>
                    <?php
                    $menus = array();
                    array_push($menus, array('href' => 'javascript:if(confirm(\'스킨 파일이 모두 삭제됩니다.\\n삭제 하시겠습니까?\')) { location.href=\'' . gp_url(GP_ADMIN_URL . '/updater.php', $gp_scope, $noqm = false) . '&utarget=skin&md=remove&skin_type=' . $skin_type . '&skin=' . $skin['dir'] . '&nocache=' . time() . '\';}', 'text' => '제거'));

                    $menus = gp_do_filter('gpa_skin_menu_' . $info['dir'], $menus);
                    ?>
        <ul>
            <?php
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
            <?php if (isset($info['Version'])) { ?>
                버전 : <?php echo $info['Version']; ?> 
                <?php } ?>
                <?php if (isset($info['Author'])) { ?>
                | 저자 : <?php if (isset($info['AuthorURI'])) { ?><a href="<?php echo $info['AuthorURI']; ?>"><?php } ?>
                <?php echo $info['Author']; ?>
                <?php if (isset($info['AuthorURI'])) { ?></a><?php } ?>
            <?php } ?>
            <?php if (isset($info['SkinURI'])) { ?>
                | <a href="<?php echo $info['SkinURI']; ?>">스킨사이트 방문</a>
            <?php } ?>
            <?php if (isset($info['DonationURI'])) { ?>
                | <a href="<?php echo $info['DonationURI']; ?>">스킨 후원하기</a>
    <?php } ?>
        </div>
    </td>
    </tr>
<?php } ?>
<?php if (empty($skins)) { ?>
    <tr>
        <td colspan="2" height="100px" align="center" valign="middle">
            스킨이 없습니다.
        </td>
    </tr>
<?php } ?>
</tbody>
</table>
<?php
include_once 'tail.php';
?>
