<?
/**
 * 소셜로그인(Social Login) - 구글
 *
 * @package net.lovelyus.plugins.sociallogin
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license 프로그램의 수정 및 배포를 금합니다.
 * @link http://lovelyus.net
 **/
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

include_once 'class.lusl.php';

class LUSLGoogle extends LUSL
{
	function login()
	{
		$this->_redirect('login');
	}

	function connect()
	{
		$this->_redirect('connect');
	}

	function _redirect($md = 'login')
	{
		include_once $this->plugin_path.DS.'lib'.DS.'openid'.DS.'openid.php';
		$openid = new LightOpenID($_SERVER['HTTP_HOST']);
	    if(!$openid->mode) {
			$openid->identity = 'https://www.google.com/accounts/o8/id';
			$openid->required = array('contact/email' , 'namePerson/first' , 'namePerson/last' );          
			goto_url($openid->authUrl());
		} elseif($openid->mode == 'cancel') {
			alert('소셜로그인 : 로그인 취소', $this->getRedirectUrl());
		} else if($openid->validate()) {
      $d = $openid->getAttributes();  
			$first_name = $d['namePerson/first'];
      $last_name = $d['namePerson/last'];
      $email = $d['contact/email'];
			$name = $first_name . " " . $last_name;			

			$su = $this->getSocialUser('GG', $email);			
			$social_user = array('type'=>'GG', 'name'=>$name, 'nickname'=>$name, 'social_id'=>$email, 'email'=>$email, 'homepage'=>'');

			set_session('sses_social_user', $social_user);

			if($md == 'connect') $this->connect_proc();
			else if($su) $this->login_proc();
			else goto_url(GP_URL.'/do.php?id='.$this->id.'&act=sociallogin&s=signup_proc');
		} else alert('소셜로그인 : 로그인 오류', $this->getRedirectUrl());
	}
}
?>
