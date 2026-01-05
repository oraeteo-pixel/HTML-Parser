<?php
/**
 * GPF 관리자 > 플러그인 원격 설치 페이지
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
include_once "_common.php";

ini_set('output_buffering', 'off');
ini_set('zlib.output_compression', false);
ini_set('implicit_flush', true);
header('Content-type: text/html');
header('Cache-Control: no-cache');

$g5['title'] = '플러그인 설치';

$gpa_page_id = 'plugins';

include_once GP_ADMIN_PATH . '/head.php';

$gp_scope = gp_scope();

function gp_should_upgrade($plugin_id, $version) {
    $info = gp_plugin_info(GP_PLUGIN_PATH . '/' . $plugin_id . '/readme.txt');
    return version_compare($version, $info['Version']) > 0;
}

// load list
if(!$page) $page = 1;
$api_url = gp_api_url('plugin_list', array('stx'=>$stx, 'page' => $page));
?>

<h2>플러그인 설치</h2>

<div class="gpa_section">
    <ul>
        <li><a href="http://lovelyus.net">러블리어스</a>에서 플러그인을 다운받아 설치합니다. </li>
        <li>설치시 입력되는 FTP정보는 러블리어스로 전송되지 않으며, 서버에도 저장되지 않습니다.</li>
        <li>설치 중 문제가 발생할 수 있으니, 서버의 파일들을 백업 후 진행하세요.</li>
</div>

<h3>업로드 설치</h3>
<form name="pluginupfrm" action="updater.php?utarget=uploadPlugin&<?php echo gp_uparam(TRUE); ?>" method="post" enctype="multipart/form-data">
    <input type="hidden" name="md" value="upload"/>
    플러그인 압축파일 : <input type="file" name="plugin_zip_file" /> <input type="submit" value="업로드"/>
    <div class="gpa_notice">* 동일한 아이디의 플러그인이 존재할 경우, 기존 플러그인은 제거됩니다.</div>
</form>

<h3>러블리어스 스토어</h3>

<div class="gpa_search">
    <form name="gsfrm" action="plugin_install.php" method="get">
    <input type="text" name="stx" class="istx" value="<?php echo htmlspecialchars($stx);?>"/>
    <input type="submit" value="검색"/>
    </form>
</div>


<?php
$gpf_api_key = _gp_read_config(GP_API_KEY_FILE, $default_data = '');
if (!$gpf_api_key) {
    echo '<div class="gpa_notice">* GPF API 가 설정되지 않아, 원격 플러그인 설치/업그레이드를 할 수 없습니다.</div>';
    include_once GP_ADMIN_PATH . '/tail.php';
    return;
}
list($code, $header, $res) = gp_http_get($api_url);
if ($code != 200) {
    alert('러블리어스에 연결할 수 없습니다 (' . $code . ')');
}

$json = json_decode($res, true);
if ($json['code'] == -1) {
    alert($json['msg']);
}
$plugin_list = $json['list'];
$total_page = $json['total_page'];
$page_rows = $json['page_rows'];

$write_pages = get_paging($page_rows, $page, $total_page, 'plugin_install.php?stx='.$stx.'&amp;page=');
?>
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
        foreach ($plugin_list as $info) {
            array_walk($info, create_function('&$value, $key', '$value = gp_get_text($value); if($key == "content") $value = url_auto_link($value); '));
            ?>
            <tr>
                <th valign="top">
        <div><?php echo $info['name']; ?></div>
        <?php
        $menus = array();
        if (!gp_is_installed($info['plugin_id'])) {
            array_push($menus, array('href' => 'javascript:gp_download_plugin(\'' . $info['plugin_id'] . '\', \'' . $info['filename'] . '\', \'' . $info['version'] . '\');', 'text' => '다운로드'));
        } else if (gp_should_upgrade($info['plugin_id'], $info['version'])) {
            array_push($menus, array('href' => 'javascript:gp_upgrade_plugin(\'' . $info['plugin_id'] . '\', \'' . $info['filename'] . '\', \'' . $info['version'] . '\');', 'text' => '업그레이드'));
        } else {
            array_push($menus, array('href' => 'javascript:gp_delete_plugin(\'' . $info['plugin_id'] . '\', \'' . $info['filename'] . '\', \'' . $info['version'] . '\');', 'text' => '제거'));
        }

        $menus = gp_do_filter('gpa_menu_plugin_' . $info['ID'], $menus);
        ?>
        <ul>
            <?php
            foreach ($menus as $menu) {
                echo '<li>';
                if ($menu['href'])
                    echo '<a href="' . $menu['href'] . '"' . $menu['attr'] . '>';
                echo $menu['text'];
                if ($menu['href'])
                    echo '</a>';
                echo '</li>';
            }
            ?>
        </ul>
    </th>
    <td valign="top">
        <div class="gpa_desc">
            <?php echo $info['content']; ?>
        </div>
        <div class="gpa_info">
            버전 : <?php echo $info['version']; ?> 
            | 저자 : <a href="<?php echo $info['author_link']; ?>"><?php echo $info['author']; ?></a> 
            <?php if ($info['link']) { ?>| <a href="<?php echo $info['link']; ?>">플러그인사이트 방문</a><?php } ?>
            <?php if ($info['donation_uri']) { ?>| <a href="<?php echo $info['donation_uri']; ?>">플러그인 후원하기</a><?php } ?>
        </div>
    </td>
    </tr>
<?php } ?>
<?php if (empty($plugin_list)) { ?>
    <tr>
        <td colspan="2" height="100px" align="center" valign="middle">
            플러그인이 없습니다.
        </td>
    </tr>
<?php } ?>
</tbody>

<?php 
if(!empty($write_pages))
{
?>
<tfoot>
    <tr>
        <td colspan="2">
            <?php echo $write_pages; ?>
        </td>
    </tr>
</tfoot>
<?php } ?>
</table>

<script type="text/javascript">
    function gp_download_plugin(plugin_id, filename, version)
    {
        if (confirm('다운로드 하시겠습니까?')) {
            location.href = '<?php echo gp_url(GP_ADMIN_URL . '/updater.php', $gp_scope, $noqm = false); ?>&utarget=plugin&md=install&store=<?php echo $store; ?>&plugin=' + plugin_id + '&filename=' + filename + '&version=' + version;
        }
    }
    function gp_upgrade_plugin(plugin_id, filename, version)
    {
        if (confirm('업그레이드시 기존 플러그인 파일은 삭제됩니다.\n업그레이드 하시겠습니까?')) {
            location.href = '<?php echo gp_url(GP_ADMIN_URL . '/updater.php', $gp_scope, $noqm = false); ?>&utarget=plugin&md=upgrade&store=<?php echo $store; ?>&plugin=' + plugin_id + '&filename=' + filename + '&version=' + version;
        }
    }
    function gp_delete_plugin(plugin_id, filename, version)
    {
        if (confirm('플러그인 파일이 모두 삭제됩니다.\n삭제 하시겠습니까?')) {
            location.href = '<?php echo gp_url(GP_ADMIN_URL . '/updater.php', $gp_scope, $noqm = false); ?>&utarget=plugin&md=remove&store=<?php echo $store; ?>&plugin=' + plugin_id + '&filename=' + filename + '&version=' + version;
        }
    }
</script>
<?php
include_once GP_ADMIN_PATH . '/tail.php';
?>
