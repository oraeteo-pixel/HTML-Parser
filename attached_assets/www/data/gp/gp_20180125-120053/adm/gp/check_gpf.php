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

$g5['title'] = '설치확인';

$gpa_page_id = str_replace('.php', '', basename(__FILE__));

gp_add_filter('gpa_tab_menus', 'gpa_add_checkgpf');

function gpa_add_checkgpf($menus) {
    global $gpa_page_id;
    array_push($menus, array('attr' => ($gpa_page_id == 'check_gpf' ? 'class="on last"' : 'class="last"'),
        'href' => 'check_gpf.php' . gp_uparam(),
        'text' => '설치확인',
        'order' => 70));
    return $menus;
}

$gpf_api_key = _gp_read_config(GP_API_KEY_FILE, $default_data = '');

include_once GP_ADMIN_PATH . '/head.php';
?>
<h2>GPF 설치 확인</h2>

<ul>
    <?php
    ob_start();
    if (!file_exists(GP_MEMBER_SKIN_PATH))
        echo '<li>"' . GP_MEMBER_SKIN_PATH . '"가 존재하지 않습니다.</li>';
    if (!file_exists(GP_SEARCH_SKIN_PATH))
        echo '<li>"' . GP_SEARCH_SKIN_PATH . '"가 존재하지 않습니다.</li>';
    $head_sub = file_get_contents(G5_PATH . DS . 'head.sub.php');
    if (strpos($head_sub, 'gp_do_action(\'load\')') === FALSE)
        echo '<li>&lt;g5&gt;/head.sub.php 파일의 &lt;html&gt; 태그 위에 &lt;?php gp_do_action(\'load\'); ?&gt; 를 추가하세요.</li>';
    if (strpos($head_sub, 'gp_do_action(\'head_script\')') === FALSE)
        echo '<li>&lt;g5&gt;/head.sub.php 파일의 &lt;body&gt; 태그 위에 &lt;?php gp_do_action(\'head_script\'); ?&gt; 를 추가하세요.</li>';
    $tail_sub = file_get_contents(G5_PATH . DS . 'tail.sub.php');
    if (strpos($tail_sub, 'gp_do_action(\'unload\')') === FALSE)
        echo '<li>&lt;g5&gt;/tail.sub.php 파일의 &lt;/html&gt; 태그 다음에 &lt;?php gp_do_action(\'unload\'); ?&gt; 를 추가하세요.</li>';

    $out = ob_get_contents();
    ob_end_clean();

    if (!$out)
        echo '<li>정상적으로 설치되었습니다.</li>';
    else
        echo $out;
    ?>
<?php
include_once GP_ADMIN_PATH . '/tail.php';
?>
