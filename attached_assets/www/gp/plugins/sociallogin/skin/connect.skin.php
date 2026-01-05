<?
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 
include_once G5_PATH."/head.php";

$loginUrls = socialLoginUrls(true, $redirect_page=urldecode($login_url));
$connectUrls = socialConnectUrls(true, $redirect_page=urldecode($login_url));
?>

<div id="social_connect">

	<h2>소셜 네트워크 연결</h2>

	<p>
		사용중인 계정을 구글, 페이스북, 트위터, 카카오톡, 네이버 계정과 연동하면 다음부터 소셜 네트워크 계정으로 로그인하실 수 있습니다.
	</p>

	<ul>
		<li><img src="<?=$plugin_url?>/imgs/google.png" alt="구글"/><a href='<?=$connectUrls['google']?>'>구글 계정 연결</a></li>
		<li><img src="<?=$plugin_url?>/imgs/facebook.png" alt="페이스북"/><a href='<?=$connectUrls['facebook']?>'>페이스북 계정 연결</a></li>
		<li><img src="<?=$plugin_url?>/imgs/twitter.png" alt="트위터"/><a href='<?=$connectUrls['twitter']?>'>트위터로 계정 연결</a></li>
		<li><img src="<?=$plugin_url?>/imgs/kakao.png" alt="카카오톡"/><a href='<?=$connectUrls['kakao']?>'>카카오톡으로 계정 연결</a></li>
		<li><img src="<?=$plugin_url?>/imgs/naver.png" alt="네이버"/><a href='<?=$connectUrls['naver']?>'>네이버로 계정 연결</a></li>
	</ul>

</div>

<style type="text/css">
	#social_connect { padding:10px; margin:20px auto; width:700px; border:3px solid #eee;}
	#social_connect ul { list-style:none; padding:0; margin:0; }
	#social_connect li { display:block; margin-right:20px; margin-bottom:10px; font-size:16px; }
	#social_connect li img { vertical-align:middle; }
	#social_connect li a { margin-left: 10px; vertical-align:middle; color:#567274; }
</style>

<? include_once G5_PATH."/tail.php"; ?>
