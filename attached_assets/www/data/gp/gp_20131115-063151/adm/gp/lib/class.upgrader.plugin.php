<?php
/**
 * GPF 플러그인 업그레이드 클래스
 *
 * 러블리어스 {@link http://lovelyus.net} 에서 플러그인을 다운받아
 * 설치 및 업그레이드 하거나, 로컬 플러그인을 삭제한다.
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
if (!defined("_GNUBOARD_"))
    exit; // 개별 페이지 접근 불가 

include_once dirname(__FILE__) . DS . 'class.upgrader.php';

/**
 * PluginUpgrader 
 * 
 * @uses GPUpgrader
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com> 
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
class PluginUpgrader extends GPUpgrader {

    /**
     * 설치/업그레이드/삭제할 플러그인 ID
     *
     * @var string
     * */
    var $plugin;

    /**
     * 플러그인 설치/업그레이드 시 다운로드할 파일명
     *
     * @var string
     * */
    var $filename;

    /**
     * __construct 
     * 
     * @access protected
     * @return void
     */
    function __construct() {
        global $plugin, $filename, $version;

        parent::__construct();

        if (!$plugin)
            alert('잘못된 연결');

        $this->basic_info = array_merge($this->basic_info, compact('plugin', 'version'));
        $this->plugin = $plugin;
        $this->filename = $filename;
    }

    /**
     * doit 
     *
     * <gp_admin>/updater.php 에서 호출하는 페이지로,
     * $md 값에 따라서 플러그인 설치, 업그레이드, 삭제 기능을 수행
     * 
     * @param string $md 실행모드
     * @access public
     * @return void
     */
    function doit($md) {
        $this->load_filemanager();

        if ($md == 'install')
            $this->installPlugin();
        else if ($md == 'upgrade')
            $this->upgradePlugin();
        else if ($md == 'remove')
            $this->uninstallPlugin();
        else
            alert('잘못된 연결 : ' . $md);
    }

    /**
     * installPlugin 
     *
     * 플러그인 설치
     *
     * 설치 프로세스
     *   1. 러블리어스에서 플러그인 파일 다운로드 : <g5>/data/gp/downloaded/<PLUGIN_FILENAME>.zip 에 저장
     *   2. 플러그인 압축 해제 : <g5>/data/gp/downloaded/ 에 압축해제
     *   3. 업그레이드 모드일 경우, 기존 플러그인 삭제
     *   4. 플러그인 복사 : <g5>/gp/plugins/<PLUGIN_ID> 로 이동
     *   5. 다운로드 데이터 삭제
     * 
     * @access public
     * @return void
     */
    function installPlugin($is_upgrade = false) {
        @chmod(G5_DATA_PATH, 0777);
        @chmod(GP_DATA_PATH, 0777);
        @chmod($this->down_path, 0777);

        $this->flush('"' . $this->plugin . '" 플러그인을 다운로드합니다.... ');
        $url = gp_api_url('download_plugin', $this->basic_info);
        if (!$url)
            alert('API 키를 설정하신 후 사용하세요');
        $zip_file = $this->down_path . DS . $this->filename;
        @unlink($zip_file);
        list($code, $header, $res, $downloaded) = gp_http_download($url, $zip_file);
        if (!$downloaded) {
            $this->error(' [ 실패 - ' . $code . ' ] <br/>');
            $this->error('* ' . $res . '<br/>');
            $this->_tail();
            return;
        }
        $this->desc(' [ 완료 ] <br/>');

        $this->flush('플러그인 압축 파일을 풉니다....');
        $dirname = $this->unzip($zip_file, $this->down_path);
        $dirpath = $this->down_path . DS . $dirname;
        if ($dirname)
            $this->desc(' [ 완료 ] <br/>');
        else {
            $this->error(' [ 실패 ] <br/>');
            unlink($zip_file);
            $this->_tail();
            return;
        }

        if ($is_upgrade)
            $this->uninstallPlugin($print_tail = false);

        $this->flush('플러그인을 GPF 플러그인 디렉토리로 이동합니다....');
        $target_path = GP_PLUGIN_PATH . DS . $dirname;
        if (!$this->fs->mkdir($this->_remote_path($target_path)))
            alert('디렉토리 생성에 실패 하였습니다 : ' . $dirname, $this->backurl);
        $res = $this->copy_dir($dirpath, $target_path);
        if (!$res) {
            $this->error(' [ 실패 ]');
            unlink($zip_file);
            $this->_tail();
            return;
        }
        $this->remove_dir($dirpath);
        $this->desc(' [ 완료 ] <br/>');

        unlink($this->down_path . DS . $this->filename); // remove downloaded zip file
        $this->_tail();
    }

    /**
     * upgradePlugin 
     *
     * 플러그인 업그레이드
     *
     * 업그레이드 프로세스
     *   1. installPlugin() 실행
     *   2. '<PLUGIN_ID>_upgraded' 액션 실행
     * 
     * @access public
     * @return void
     */
    function upgradePlugin() {
        $this->installPlugin($is_upgrade = true);
        $gp_scope = GP_SCOPE_SITE;
        @include_once GP_PLUGIN_PATH . DS . $this->plugin . DS . 'plugin.php';
        gp_do_action($this->plugin . '_upgraded');
    }

    /**
     * uninstallPlugin 
     *
     * 플러그인 삭제
     *
     * 삭제 프로세스
     *   1. '<PLUGIN_ID>_before_removed' 액션 실행
     *   2. 플러그인 삭제 : <g5>/gp/plugins/<PLUGIN_ID> 삭제
     * 
     * @access public
     * @return void
     */
    function uninstallPlugin($print_tail = true) {
        $gp_scope = GP_SCOPE_SITE;
        @include_once GP_PLUGIN_PATH . DS . $this->plugin . DS . 'plugin.php';
        gp_do_action($this->plugin . '_before_removed');
        $this->flush('설치된 플러그인을 제거합니다....');
        $res = $this->fs->delete($this->_remote_path(GP_PLUGIN_PATH . DS . basename($this->plugin)), true);
        if ($res)
            $this->desc(' [ 완료 ] <br/>');
        else
            $this->error(' [ 실패 ] <br/>');

        if ($print_tail)
            $this->_tail();
    }

    /**
     * _tail 
     *
     * 프로세스 완료 후, 하단 메시지 출력
     * 
     * @access protected
     * @return void
     */
    function _tail() {
        global $md, $plugin;
        
        @chmod(G5_DATA_PATH, 0707);
        @chmod(GP_DATA_PATH, 0707);
        @chmod($this->down_path, 0707);
        
        if($md != 'remove' && !$this->has_error) $this->flush('<br/>플러그인 정보 페이지로 이동합니다... ');                
        
        $msg = '<br/><a href="plugin_install.php?'. gp_uparam(TRUE) . '">플러그인 설치 페이지로 이동</a> | <a href="plugins.php?'. gp_uparam(TRUE) . '">플러그인 목록 페이지로 이동</a>';
        $this->flush($msg);

        if($md != 'remove' && !$this->has_error) 
        {
            sleep(2);
            goto_url('plugininfo.php?plugin='.$plugin.'&'.  gp_uparam(TRUE));
        }        
    }

}

?>
