<?php
/**
 * GPF 관리자 > 업그레이드 페이지
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
include_once "_common.php";

$g5['title'] = '업그레이드';

$gpa_page_id = str_replace('.php', '', basename(__FILE__));

gp_add_filter('gpa_tab_menus', 'gpa_add_gpfupgrade');

function gpa_add_gpfupgrade($menus) {
    global $gpa_page_id;
    array_push($menus, array('attr' => ($gpa_page_id == 'gpf_upgrade' ? 'class="on last"' : 'class="last"'),
        'href' => 'gpf_upgrade.php' . gp_uparam(),
        'text' => '업그레이드',
        'order' => 70));
    return $menus;
}

$gpf_api_key = _gp_read_config(GP_API_KEY_FILE, $default_data = '');

if (!$gpf_api_key) {
    alert('GPF API 키를 설정하신 후 사용하세요.', 'gpf_setting.php' . gp_uparam());
    exit;
}

include_once GP_ADMIN_PATH . '/head.php';

$gp_scope = gp_scope();

list($code, $header, $res) = gp_http_get(gp_api_url('gpf_version'));
if ($code != 200)
    alert('러블리어스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요');

$has_new_version = version_compare($res, GP_VERSION) > 0;
?>

<h2>GPF 업그레이드</h2>
<?php if ($has_new_version) { ?>
    <div class="gpa_section">
        <ul>
            <li><a href="http://lovelyus.net">러블리어스</a>에서 GPF 코어를 다운받아 설치합니다. </li>
            <li>설치시 입력되는 FTP정보는 러블리어스로 전송되지 않으며, 서버에도 저장되지 않습니다.</li>
            <li>설치 중 문제가 발생할 수 있으니, 서버의 파일들을 백업 후 진행하세요.</li>
    </div>

    <br/>
    <input type="button" value="업그레이드 시작" id="gpa_do_upgrade" />
    <script type="text/javascript">
        $(document).ready(function() {
            $('#gpa_do_upgrade').click(function() {
                window.location.href = 'updater.php?utarget=gpf<?php echo gp_uparam(); ?>';
            });
        });
    </script>
<?php } else { ?>
    <div class="gpa_section">
        <ul>
            <li>현재 설치된 GPF는 최신버전입니다</li>
        </ul>
    </div>
<?php } ?>
<?php
include_once GP_ADMIN_PATH . '/tail.php';
?>
