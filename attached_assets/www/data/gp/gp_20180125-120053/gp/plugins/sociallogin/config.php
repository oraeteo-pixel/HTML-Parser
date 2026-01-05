<?
/**
 *
 * 소셜 로그인(Social Login) 플러그인 환경설정 스크립트
 *
 * @license 프로그램의 수정 및 배포를 금합니다.
 * @author    chongmyung.park (http://byfun.com)
 */

$plugin_config = gp_read_config(SOCIAL_LOGIN_CONFIG_FILE, array(), GP_SCOPE_SITE);

if (!isset($plugin_config['nv_client_id'])) $plugin_config['nv_client_id'] = "";
if (!isset($plugin_config['nv_client_secret'])) $plugin_config['nv_client_secret'] = "";
if (!isset($plugin_config['gg_client_id'])) $plugin_config['gg_client_id'] = "";
if (!isset($plugin_config['gg_client_secret'])) $plugin_config['gg_client_secret'] = "";
if (!isset($plugin_config['fb_app_id'])) $plugin_config['fb_app_id'] = "";
if (!isset($plugin_config['fb_app_secret'])) $plugin_config['fb_app_secret'] = "";
if (!isset($plugin_config['tw_consumer_key'])) $plugin_config['tw_consumer_key'] = "";
if (!isset($plugin_config['tw_consumer_secret'])) $plugin_config['tw_consumer_secret'] = "";
if (!isset($plugin_config['tw_consumer_secret'])) $plugin_config['tw_consumer_secret'] = "";
if (!isset($plugin_config['m2_api_key'])) $plugin_config['m2_api_key'] = "";
?>
<style>
    ul.config_form_list li label.gsl_lb {
        display: inline-block;
        width: 140px;
    }

    .descr {
        color: #888;
    }

    .push {
        margin-left: 80px;
    }
</style>
<form name="slfrm" method="post" action="admin_do.php">
    <input type="hidden" name="bo_table" value="<?= $GLOBALS['bo_table'] ?>"/>
    <input type="hidden" name="gr_id" value="<?= $GLOBALS['gr_id'] ?>"/>
    <input type="hidden" name="id" value="<?= $this->id ?>"/>
    <input type="hidden" name="act" value="sol_save_setting"/>
    <input type="hidden" name="w" value="u"/>

    <ul class="config_form_list">
        <li>
            <label class="gsl_lb">카카오톡 API 키</label>
            <input type="text" size="40" name="plugin_config[kt_api_key]" id="gsl_kt_api_key"
                   value="<?= htmlspecialchars($plugin_config['kt_api_key']) ?>"/>
            <span class="descr"><a href="https://developers.kakao.com/">카카오톡 개발자 센터에서 발급</a> </span>
        </li>
        <li>
            <label class="gsl_lb">구글 Client Id</label>
            <input type="text" size="40" name="plugin_config[gg_client_id]" id="gsl_gg_client_id"
                   value="<?= htmlspecialchars($plugin_config['gg_client_id']) ?>"/>
            <span class="descr"><a href="https://console.developers.google.com">구글 개발자 콘솔에서 발급</a> </span>
        </li>
        <li>
            <label class="gsl_lb">구글 Client Secret</label>
            <input type="text" size="40" name="plugin_config[gg_client_secret]"
                   value="<?= htmlspecialchars($plugin_config['gg_client_secret']) ?>"/>
        </li>
        <li>
            <label class="gsl_lb">페이스북 App Id</label>
            <input type="text" size="40" name="plugin_config[fb_app_id]" id="gsl_fb_app_id"
                   value="<?= htmlspecialchars($plugin_config['fb_app_id']) ?>"/>
            <span class="descr"><a href="https://developers.facebook.com/apps">페이스북 개발자 센터에서 발급</a> </span>
        </li>
        <li>
            <label class="gsl_lb">페이스북 App Secret</label>
            <input type="text" size="40" name="plugin_config[fb_app_secret]"
                   value="<?= htmlspecialchars($plugin_config['fb_app_secret']) ?>"/>
        </li>
        <li>
            <label class="gsl_lb">트위터 Consumer Key</label>
            <input type="text" size="40" name="plugin_config[tw_consumer_key]"
                   value="<?= htmlspecialchars($plugin_config['tw_consumer_key']) ?>"/>
            <span class="descr"><a href="https://dev.twitter.com/apps">트위터 개발자 센터에서 발급</a></span>
        </li>
        <li>
            <label class="gsl_lb">트위터 Consumer Secret</label>
            <input type="text" size="40" name="plugin_config[tw_consumer_secret]"
                   value="<?= htmlspecialchars($plugin_config['tw_consumer_secret']) ?>"/>
        </li>
        <li>
            <label class="gsl_lb">네이버 Client Id</label>
            <input type="text" size="40" name="plugin_config[nv_client_id]" id="gsl_nv_client_id"
                   value="<?= htmlspecialchars($plugin_config['nv_client_id']) ?>"/>
            <span class="descr"><a href="https://developer.naver.com/openapi/register.nhn">네이버 개발자 센터에서 발급</a> </span>
        </li>
        <li>
            <label class="gsl_lb">네이버 Client Secret</label>
            <input type="text" size="40" name="plugin_config[nv_client_secret]"
                   value="<?= htmlspecialchars($plugin_config['nv_client_secret']) ?>"/>
        </li>
        <li class="push">
            <input type="submit" class="gp_btn" value="설정 저장"/>
        </li>
    </ul>
</form>
