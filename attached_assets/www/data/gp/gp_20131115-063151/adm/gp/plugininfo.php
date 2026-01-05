<?php
/**
 *
 * GPF 코어 업그레이드 내역
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
include_once '_common.php';

$gpa_page_id = 'plugins';

include_once GP_ADMIN_PATH . DS . 'head.php';

$plugin_content = file_get_contents(GP_PLUGIN_PATH.DS.$plugin.DS.'readme.txt');
if(!$plugin_content) alert('플러그인 정보 : 잘못된 연결');

$plugin_header = array(
    'Scope' => 'Plugin Scope',
    'Name' => 'Plugin Name',
    'PluginURI' => 'Plugin URI',
    'Version' => 'Version',
    'Description' => 'Description',
    'Author' => 'Author',
    'Platform' => 'Platform',
    'AuthorURI' => 'Author URI',
    'License' => 'Plugin License',
    'Required' => 'Required GPF Version',
    'DonationURI' => 'Donation URI',
    'Tags' => 'Tags',
    'Tested' => 'Tested up to'
);
foreach ($plugin_header as $field => $regex) {
    if (preg_match('/^[ \t\/*#@]*' . preg_quote($regex, '/') . ':(.*)$/mi', $plugin_content, $match) && $match[1]) {
        $plugin_header[$field] = trim(preg_replace("/\s*(?:\*\/|\?>).*/", '', $match[1]));
        $plugin_content = str_replace($match[0] . "\n", '', $plugin_content);
    } else {
        $plugin_header[$field] = '';
    }
}

$plugin_codes = array();

include_once GP_ADMIN_PATH.DS.'lib'.DS.'markdown'.DS.'markdown.php';
$content = '<div class="markdown">' . Markdown($plugin_content) . '</div>';

preg_replace_callback('/\[code\s?([\w]{0,})\](.*?)\[\/code\]/si', '_gp_save_code', $plugin_content);
$content = preg_replace_callback('/\[code\s?([\w]{0,})\](.*?)\[\/code\]/si', '_gp_do_code_parse', $content);


?>
<br/>
<h1>플러그인 정보</h1>

<?php if($plugin_header['DonationURI']) { ?>
<div class="gp_donation">
    <a href="<?php echo $plugin_header['DonationURI']; ?>" class="gp_donation_btn" target="_blank">플러그인 후원하기</a>
    <div class="gp_donation_exp">
        더 좋은 소프트웨어 개발을 위해<br/> 개발자님을 후원해주세요.
    </div>
</div>
<?php } ?>

<div class="gp_section markdown">
    <ul>
        <li>플러그인명 : <strong><?php echo $plugin_header['Name']; ?></strong></li>
        <li>버전 : <?php echo $plugin_header['Version']; ?></li>
        <li>범위 : <?php echo  ($plugin_header['Scope'] == 'BOARD' ? '게시판' : '사이트'); ?></li>
        <li>저자 : <a href="<?php echo $plugin_header['AuthorURI']; ?>" target="_blank"><?php echo $plugin_header['Author']; ?></a></li>
        <?php if(isset($plugin_header['PluginURI'])) { ?><li>플러그인 사이트 : <a href="<?php echo $plugin_header['PluginURI']; ?>" target="_blank"><?php echo $plugin_header['PluginURI']; ?></a></li><?php } ?>
        <li>요구되는 최소 GPF 버전 : <?php echo $plugin_header['Required']; ?>
        <?php if ($plugin_header['Tested'] > $plugin_header['Required']) 
            echo '<span style="margin-left:10px;color:#888">(' . $plugin_header['Tested'] . '버전 까지 테스트되었습니다.)</span>';        
        ?>
            </li>
        <?php if(isset($plugin_header['License'])) { ?><li>라이선스 : <a href="<?php echo $plugin_header['License']; ?>" target="_blank"><?php echo $plugin_header['License']; ?></a></li><?php } ?>
    </ul>
</div>

<h1>플러그인 설명</h1>
<div class="gp_section">
    <?php echo $content; ?>
</div>

<div style="text-align:center;">
    <a href="plugins.php<?php echo gp_uparam();?>">플러그인 목록</a> | <a href="plugin_install.php<?php echo gp_uparam();?>">플러그인 설치</a> 
</div>

<style>
    .gp_section{margin:0 0 30px 0;padding:10px;border:2px solid #eee;}
    .gp_donation{float:right;margin:10px;padding:10px;width:200px;text-align:center}
    .gp_donation_btn{display:inline-block;width:190px;font-weight: bold;height: 50px;cursor: pointer;border-radius: 5px 5px 5px 5px;line-height: 50px;background-color: #000;color: #fff500 !important;}
    .gp_donation_exp{margin-top:10px;color:#888;}
</style>
<link type="text/css" rel="stylesheet" href="<?php echo GP_ADMIN_URL ?>/css/markdown.css"/>
<script type="text/javascript" src="<?php echo GP_ADMIN_URL ?>/js/sh/scripts/shCore.js"></script>
<script type="text/javascript" src="<?php echo GP_ADMIN_URL ?>/js/sh/scripts/shBrushAll.js" ></script>
<link type="text/css" rel="stylesheet" href="<?php echo GP_ADMIN_URL ?>/js/sh/styles/shCore.css"/>
<link type="text/css" rel="stylesheet" href="<?php echo GP_ADMIN_URL ?>/js/sh/styles/shThemeDefault.css"/>
<script type="text/javascript">
    SyntaxHighlighter.config.clipboardSwf = '<?php echo GP_ADMIN_URL ?>/js/sh/scripts/clipboard.swf';
    SyntaxHighlighter.all();
</script>

<?php
include_once GP_ADMIN_PATH . DS . 'tail.php';


function _gp_save_code($matches) {
    global $plugin_codes;
    array_push($plugin_codes, $matches[2]);
}

function _gp_do_code_parse($matches) {
    global $plugin_codes;
    $code = $plugin_codes[0];
    $code = htmlspecialchars($code);
    array_shift($plugin_codes);
    return "<pre class='brush: {$matches[1]}'>" . $code . "</pre>";
}
?>
