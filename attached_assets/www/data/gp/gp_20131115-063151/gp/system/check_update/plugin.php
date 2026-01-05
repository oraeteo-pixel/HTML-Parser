<?
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

// 관리자 페이지에서만 실행
if(!defined('G5_IS_ADMIN') || $is_admin != 'super') return;

$gp_check_interval = 43200; // 12시간 마다 체크

$gp_ct_cfg_file = GP_DATA_PATH.DS.'cfg.check_update.php';

$gp_ct= _gp_read_config($gp_ct_cfg_file, array('check_time'=>G5_SERVER_TIME, 'has_new_version'=>0, 'version'=>GP_VERSION));

if($gp_ct['has_new_version'] && version_compare($gp_ct['version'], GP_VERSION) > 0) {    

    function gp_script_should_update()
    {
        global $gp_ct;
        ?>
        <script type="text/javascript">
            $(document).ready(function() {
                $('body').prepend([
                    '<div style="width:100%;margin:0;padding:10px 0;border-bottom:1px solid #444;background-color:#000;color:#FFFF00;text-align:center">'
                    ,   '그누보드 플러그인 프레임워크 <?php echo $gp_ct['version']; ?> 버전이 나왔습니다! : '
                    ,   '<a href="<?php echo GP_ADMIN_URL;?>/gpf_upgrade.php" style="color:#C6F5F7">업그레이드 하기</a>'
                    ,'</div>'                    
                ].join(''));
            });
        </script>
        <?php
    }

    gp_add_action('head_script', 'gp_script_should_update');
    return;
}

// 체크 인터벌이 안됬으면 체크 안함
if(G5_SERVER_TIME != $gp_ct['check_time'] && G5_SERVER_TIME - $gp_ct['check_time'] < $gp_check_interval) return;

gp_add_action('pxa_check_update', 'gp_check_update');
gp_add_action('head_script', 'gp_script_check_update');

function gp_script_check_update()
{
    ?>
    <script type="text/javascript">
        $.ajax({
            url : '<?php echo GP_ADMIN_URL;?>/admin_do.php',
            data : { 'id' : 'system/check_update', 'act' : 'check_update' },
            dataType : 'json',
            method : 'post',
            success : function(json) {
                if(json.code != 1) return;
                if(json.has_new_version) {
                    $('body').prepend([
                        '<div style="width:100%;margin:0;padding:10px 0;border-bottom:1px solid #444;background-color:#000;color:#FFFF00;text-align:center">'
                        ,   '그누보드 플러그인 프레임워크 ' + json.version + ' 버전이 나왔습니다! : '
                        ,   '<a href="<?php echo GP_ADMIN_URL;?>/gpf_upgrade.php" style="color:#C6F5F7">업그레이드 하기</a>'
                        ,'</div>'                    
                    ].join(''));
                }
            }
        });
    </script>
    <?php
}

function gp_check_update() {
    
    global $gp_ct_cfg_file;

    @unlink($gp_ct_cfg_file);

    $gpf_api_key = _gp_read_config(GP_API_KEY_FILE, $default_data = '');
    
    // GPF API KEY 가 없으면 체크 안함
    if (!$gpf_api_key) {
        _gp_write_config($gp_ct_cfg_file, array('check_time'=>G5_SERVER_TIME, 'has_new_version'=>false, 'version'=>GP_VERSION));
        die( json_encode( array('code'=>-1, 'msg'=>'GPF API 키가 설정되지 않았습니다.')));
    }

    list($code, $header, $res) = gp_http_get(gp_api_url('gpf_version'));

    if ($code != 200) {
        _gp_write_config($gp_ct_cfg_file, array('check_time'=>G5_SERVER_TIME, 'has_new_version'=>false, 'version'=>GP_VERSION));            
        die( json_encode( array('code'=>-1, 'msg'=>'러블리어스에 연결할 수 없습니다.')));
    }
    
    $has_new_version = version_compare($res, GP_VERSION) > 0;
    
    _gp_write_config($gp_ct_cfg_file, array('check_time'=>G5_SERVER_TIME, 'has_new_version'=>$has_new_version, 'version'=>$res));    
    
    die( json_encode( array('code'=>1, 'has_new_version'=>$has_new_version, 'version'=>$res)));
}



?>
