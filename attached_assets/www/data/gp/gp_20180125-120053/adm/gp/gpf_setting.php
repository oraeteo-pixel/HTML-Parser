<?php
/**
 * GPF 관리자 > GPF 설정
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
include_once "_common.php";

$g5['title'] = 'GPF 설정';

$gpa_page_id = str_replace('.php', '', basename(__FILE__));

gp_add_filter('gpa_tab_menus', 'gpa_add_gpfsetting');

function gpa_add_gpfsetting($menus) {
    global $gpa_page_id;
    array_push($menus, array('attr' => ($gpa_page_id == 'gpf_setting' ? 'class="on last"' : 'class="last"'),
        'href' => 'gpf_setting.php' . gp_uparam(),
        'text' => 'GPF 설정',
        'order' => 70));
    return $menus;
}

if ($md == 'save_api_key') {
    if (!$api_key) {
        unlink(GP_API_KEY_FILE);
        alert('삭제하였습니다.', $_SERVER['SCRIPT_NAME'] . gp_uparam());
    }
    $url = gp_api_url('check_api_key', array('new_key' => $api_key));
    list($code, $header, $res) = gp_http_get($url);
    if ($code != 200)
        alert('러블리어스에 연결할 수 업습니다. (' . $code . ')');
    $json = json_decode($res, true);
    if ($json['code'] == -1)
        alert('사용할 수 없는 키입니다.');

    _gp_write_config(GP_API_KEY_FILE, $api_key);
    alert('저장하였습니다.', $_SERVER['SCRIPT_NAME'] . gp_uparam());
    exit;
}

$gpf_api_key = _gp_read_config(GP_API_KEY_FILE, $default_data = '');

include_once GP_ADMIN_PATH . '/head.php';
?>
<h2>GPF 설정</h2>

<h3>API 키</h3>
<p>
    플러그인 원격 설치를 위해 GPF API 키가 필요합니다. <br/>
    API 키는 <a href="http://lovelyus.net">러블리어스</a>의 마이페이지에서 생성할 수 있습니다.<br/>
<form name="keyfrm" method="post" action="<?php echo $_SERVER['SCRIPT_NAME']; ?>">
    <input type="hidden" name="md" value="save_api_key"/>
    <input type="hidden" name="bo_table" value="<?php echo $bo_table; ?>">
    <input type="hidden" name="gr_id" value="<?php echo $gr_id; ?>">
    GPF API Key <input type="text" name="api_key" value="<?php echo htmlspecialchars($gpf_api_key); ?>" style="width:250px" />
    <input type="submit" value=" 설정 "/>
</form>
</p>

<?php
include_once GP_ADMIN_PATH . '/tail.php';
?>
