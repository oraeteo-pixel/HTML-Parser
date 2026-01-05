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

$gpa_page_id = 'skins';

include_once GP_ADMIN_PATH . DS . 'head.php';

$skin_content = file_get_contents(G5_SKIN_PATH.DS.$skin_type.DS.$skin.DS.'readme.txt');
if(!$skin_content) alert('스킨 정보 : 잘못된 연결');

$skin_header = array(
    'Platform' => 'Platform',
    'SkinType' => 'Skin Type',
    'Name' => 'Skin Name',
    'SkinURI' => 'Skin URI',
    'Version' => 'Version',
    'Description' => 'Description',
    'Author' => 'Author',
    'AuthorURI' => 'Author URI',
    'License' => 'Skin License',
    'DonationURI' => 'Donation URI',
    'Tags' => 'Tags',
    'Required G5' => 'Required G5 Version',
    'Tested' => 'Tested up to'
);

foreach ($skin_header as $field => $regex) {
    if (preg_match('/^[ \t\/*#@]*' . preg_quote($regex, '/') . ':(.*)$/mi', $skin_content, $match) && $match[1]) {
        $skin_header[$field] = trim(preg_replace("/\s*(?:\*\/|\?>).*/", '', $match[1]));
        $skin_content = str_replace($match[0] . "\n", '', $skin_content);
    } else {
        if ($field == 'Platform' || $field == 'SkinType' || $field == 'Name' || $field == 'Version' || $field == 'Description' || $field == 'Author') {
            alert("알림 : readme.txt 의 스킨 정보가 불충분합니다.");
            return;
        }
        $skin_header[$field] = '';
    }
}

$skin_codes = array();

include_once GP_ADMIN_PATH.DS.'lib'.DS.'markdown'.DS.'markdown.php';
$content = '<div class="markdown">' . Markdown($skin_content) . '</div>';

preg_replace_callback('/\[code\s?([\w]{0,})\](.*?)\[\/code\]/si', '_gp_save_code', $skin_content);
$content = preg_replace_callback('/\[code\s?([\w]{0,})\](.*?)\[\/code\]/si', '_gp_do_code_parse', $content);


?>
<br/>
<h1>스킨 정보</h1>

<?php if($skin_header['DonationURI']) { ?>
<div class="gp_donation">
    <a href="<?php echo $skin_header['DonationURI']; ?>" class="gp_donation_btn" target="_blank">스킨 후원하기</a>
    <div class="gp_donation_exp">
        더 좋은 소프트웨어 개발을 위해<br/> 개발자님을 후원해주세요.
    </div>
</div>
<?php } ?>

<div class="gp_section markdown">
    <ul>
        <li>스킨명 : <strong><?php echo $skin_header['Name']; ?></strong></li>
        <li>스킨위치 : G5/skin/<?php echo $skin_header['SkinType'].'/'.$skin; ?></li>
        <li>버전 : <?php echo $skin_header['Version']; ?></li>
        <li>저자 : <a href="<?php echo $skin_header['AuthorURI']; ?>" target="_blank"><?php echo $skin_header['Author']; ?></a></li>
        <?php if(isset($skin_header['SkinURI'])) { ?><li>스킨 사이트 : <a href="<?php echo $skin_header['SkinURI']; ?>" target="_blank"><?php echo $skin_header['SkinURI']; ?></a></li><?php } ?>
        <li>요구되는 최소 G5 버전 : <?php echo $skin_header['Required G5']; ?>
        <?php if ($skin_header['Tested'] > $skin_header['Required G5']) 
            echo '<span style="margin-left:10px;color:#888">(' . $skin_header['Tested'] . '버전 까지 테스트되었습니다.)</span>';        
        ?>
         </li>
        <?php if(isset($skin_header['License'])) { ?><li>라이선스 : <a href="<?php echo $skin_header['License']; ?>" target="_blank"><?php echo $skin_header['License']; ?></a></li><?php } ?>
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
    global $skin_codes;
    array_push($skin_codes, $matches[2]);
}

function _gp_do_code_parse($matches) {
    global $skin_codes;
    $code = $skin_codes[0];
    $code = htmlspecialchars($code);
    array_shift($skin_codes);
    return "<pre class='brush: {$matches[1]}'>" . $code . "</pre>";
}
?>
