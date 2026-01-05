<?php
/**
 * GPF 관리자 > 첫페이지
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
include_once "_common.php";

$g5['title'] = '시작';

$gpa_page_id = str_replace('.php', '', basename(__FILE__));
include_once 'head.php';
?>

<h2>Welcome to GPF</h2>

<p>그누보드 플러그인 프레임워크(GPF)는 그누보드를 수정하지 않고, 쉽게 플러그인을 제작하고 사용하기 위한 프레임워크입니다.</p>
<p>GPF 는 무료 프로그램으로 GPF 및 플러그인의 개발과 유지 보수를 위해 많은 시간과 노력이 들어갑니다. </p>
<p>또한 플러그인과 스킨의 자동 설치,업그레이드를 위한 호스팅을 운영하고 있습니다.</p>
<p>더 나은 소프트웨어 개발과 서비스를 위해 후원해주세요 : <a href="http://lovelyus.net/donation" target="_blank" style="color:red;font-weight:bold">[후원하기]</a> </p>

<br/><br/>
<?php $y = date('Y'); ?>
<div style="text-align:center;margin-bottom:30px;">2013<?php echo ($y > 2013 ? '-' . $y : ''); ?> © <a href="http://lovelyus.net/" target="_blank">러블리어스</a></div>

<?php
include_once 'tail.php';
?>
