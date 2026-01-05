<?
/**
 * 소셜로그인(Social Login) - 페이스북
 *
 * @package net.lovelyus.plugins.sociallogin
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license 프로그램의 수정 및 배포를 금합니다.
 * @link http://lovelyus.net
 **/
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

include_once 'class.lusl.php';

class LUSLFacebook extends LUSL
{
	function login()
	{
		$this->redirect('login');
	}

	function connect()
	{
		$this->redirect('connect');
	}

	function redirect($md = 'login')
	{
		include_once $this->plugin_path.DS.'lib'.DS.'facebook'.DS.'facebook.php';
		$facebook = new Facebook(array(
			'appId'  => $this->plugin_config['fb_app_id'],
			'secret' => $this->plugin_config['fb_app_secret']
		));
		$params = array( 'redirect_uri' => GP_URL.'/do.php?id='.$this->id.'&act=sociallogin&s=callback_facebook&md='.$md, 'scope'=>'email');
		$loginUrl = $facebook->getLoginUrl($params);
		goto_url($loginUrl);
	}

	// PX : callback_facebook : call by FB
	function callback()
	{
		extract($GLOBALS); extract($_POST); extract($_GET);

		$fb = $this->getFBUser();

		if(!$fb['logedin']) alert('소셜로그인: 로그인 실패', $this->getRedirectUrl());

		$su = $this->getSocialUser('FB', $fb['user']['id']);
		
		$social_user = array('type'=>'FB', 'name'=>$fb['user']['name'], 'nickname'=>$fb['user']['name'], 'email'=>$fb['user']['email'], 'social_id'=>$fb['user']['id'], 'homepage'=>$fb['user']['link']);

		set_session('sses_social_user', $social_user);

		if($md == 'connect') $this->connect_proc();
		else if($su) $this->login_proc();
		else goto_url(GP_URL.'/do.php?id='.$this->id.'&act=sociallogin&s=signup_proc');
	}

	// FB 사용자 반환
	function getFBUser()
	{
		extract($GLOBALS); extract($_POST); extract($_GET);

		include_once $this->plugin_path.DS.'lib'.DS.'facebook'.DS.'facebook.php';

		$status = array('logedin'=>false);

		$facebook = new Facebook(array(
			'appId'  => $this->plugin_config['fb_app_id'],
			'secret' => $this->plugin_config['fb_app_secret']
		));

		$user = $facebook->getUser();

		if ($user) {
			try {
				$me = $facebook->api('/me?fields=id,name,email,link');
				$status['user'] = $me;
				$status['logedin'] = true;
			} catch (FacebookApiException $e) {
				error_log($e);
				$user = null;
			}
		}

		// Login or logout url will be needed depending on current user state.
		$params = array( 'redirect_uri' => GP_URL.'/do.php?id='.$this->id.'&act=sociallogin&s=callback_facebook');
		if ($user) {
			$logoutUrl = $facebook->getLogoutUrl($params);
			$status['social_url'] = $logoutUrl;
			$status['url'] = GP_URL.'/do.php?id='.$this->id.'&act=sociallogin&s=logout&social_url='.urlencode($status['social_url'])."&gpf_next=".$GLOBALS['urlencode'];
		} else {
			$loginUrl = $facebook->getLoginUrl($params);
			$status['social_url'] = $loginUrl;
			$status['url'] = GP_URL.'/do.php?id='.$this->id.'&act=sociallogin&s=login_facebook&social_url='.urlencode($status['social_url'])."&gpf_next=".$GLOBALS['urlencode'];
		}
		return $status;
	}
}
?>
