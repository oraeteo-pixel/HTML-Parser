<?php
/**
 * 연결 정보 입력받는 페이지
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
include_once '_common.php';

define('CONNECTION_INFO_FILE', 'cfg.connection_info.php');

if (!$url)
    alert('잘못된 연결');
include_once 'head.php';

$lb = '';
if (extension_loaded('ftp') || extension_loaded('sockets') || function_exists('fsockopen'))
    $lb .= 'FTP';
if (extension_loaded('ssh2') && function_exists('stream_get_contents'))
    $lb .= ($lb ? '/' : '') . 'SSH';
if (!$lb)
    alert('연결 가능한 방법이 없습니다.\n(FTP와 SSH 모두 사용불가)');

if (!$hostname || !$username || !$password || !$port || !$g5_remote_path) {
    $connection_info = gp_read_config(CONNECTION_INFO_FILE, array(), GP_SCOPE_SITE);
    if (!isset($connection_info['hostname']))
        $connection_info['hostname'] = $_SERVER['HTTP_HOST'];
    if (!isset($connection_info['port']))
        $connection_info['port'] = 21;
    if (!isset($connection_info['username']))
        $connection_info['username'] = '';
    if (!isset($connection_info['g5_remote_path']))
        $connection_info['g5_remote_path'] = G5_PATH;
    if (!isset($connection_info['connection_type']))
        $connection_info['connection_type'] = 'ftp';
    if (!isset($connection_info['public_key']))
        $connection_info['public_key'] = '';
    if (!isset($connection_info['private_key']))
        $connection_info['private_key'] = '';
    ?>
    <style>
        .connection_info{border:1px solid #efefef;}
        .connection_info legend{display:none;}
        .connection_info dt{float:left;margin-bottom:5px;width:120px;text-align:right;}
        .connection_info dd{margin-bottom:5px;margin-left:130px;}
        .connection_info .itxt{width:200px;border:1px solid #eee;}
        .connection_info .sblb{display:inline-block;width:80px;text-align:right;}
    </style> 
    <h3>서버 연결 정보</h3>
    <form name="connectionfrm" method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
        <input type="hidden" name="backurl" value="<?php echo htmlspecialchars($_SERVER['HTTP_REFERER']); ?>"/>
    <?php
    foreach ($_REQUEST as $key => $value) {
        echo '<input type="hidden" name="' . htmlspecialchars($key) . '" value="' . htmlspecialchars($value) . '"/>' . PHP_EOL;
    }
    ?>
        <fieldset class="connection_info">
            <legend>연결 정보 입력</legend>
            <dl>
                <dt>호스트</dt>
                <dd><input type="text" name="hostname" required itemname="connection 호스트" value="<?php echo $connection_info['hostname']; ?>" class="itxt"/></dd>
            </dl>
            <dl>
                <dt><?php echo $lb; ?> 포트</dt>
                <dd><input type="text" name="port" required itemname="connection 포트" value="<?php echo $connection_info['port']; ?>" class="itxt"/></dd>
            </dl>
            <dl>
                <dt><?php echo $lb; ?> 사용자</dt>
                <dd><input type="text" name="username" required itemname="connection 아이디" value="<?php echo $connection_info['username']; ?>" class="itxt"></dd>
            </dl>
            <dl>
                <dt><?php echo $lb; ?> 패스워드</dt>
                <dd><input type="password" name="password" required itemname="connection 패스워드" class="itxt"/></dd>
            </dl>
            <dl>
                <dt>연결 후 그누보드 위치</dt>
                <dd><input type="text" name="g5_remote_path" required itemname="connection 그누보드 위치" value="<?php echo $connection_info['g5_remote_path']; ?>" class="itxt" style="width:500px"/></dd>
            </dl>
            <dl id="ssh_auth_info" style="display:none">
                <dt>인증 키 위치</dt>
                <dd>
                    <label class="sblb">Public Key: </label><input type="text" name="public_key" value="<?php echo htmlspecialchars($connection_info['public_key']); ?>" class="itxt" style="width:420px"/><br/>
                    <label class="sblb">Private Key: </label><input type="text" name="private_key" value="<?php echo htmlspecialchars($connection_info['private_key']); ?>" class="itxt" style="width:420px" />
                </dd>
            </dl>
            <dl>
                <dt>연결유형</dt>
                <dd>
                    <input type="radio" name="connection_type" id="connection_type_ftp" value="ftp"/><label for="connection_type_ftp">FTP</label> 
                    <input type="radio" name="connection_type" id="connection_type_ftps" value="ftps"/><label for="connection_type_ftps">FTPS(SSL)</label> 
                    <input type="radio" name="connection_type" id="connection_type_ssh" value="ssh"/><label for="connection_type_ssh">SSH2</label> 
                </dd>
            </dl>
            <dl>
                <dd>
                    <input type="submit" value="확인" />
                </dd>
            </dl>
        </fieldset>
    </form>
    <script type="text/javascript">
        function toggle_info(slt)
        {
            $ssh = $('#ssh_auth_info');
            if (slt == 'ftp')
            {
                $ssh.hide();
            } else {
                $ssh.show();
            }
        }
        $('#connection_type_ssh').click(function() {
            toggle_info('ssh');
        });
        $('#connection_type_ftp').click(function() {
            toggle_info('ftp');
        });
        $('#connection_type_ftps').click(function() {
            toggle_info('ftp');
        });
        $(document).ready(function() {
            var conn_type = '<?php echo $connection_info['connection_type']; ?>';
            $('#connection_type_' + conn_type).attr('checked', 'checked');
            if ($('#connection_type_ssh').is('checked')) {
                toggle_info('ssh');
            }
        });
    </script>
    <?php
} else {
    if (!$_REQUEST['hostname'])
        return;
    $connection_info = array('hostname' => $_REQUEST['hostname'], 'username' => $_REQUEST['username'], 'port' => $_REQUEST['port'], 'g5_remote_path' => $_REQUEST['g5_remote_path'], 'connection_type' => $_REQUEST['connection_type'], 'public_key' => $_REQUEST['public_key'], 'private_key' => $_REQUEST['private_key']);
    gp_write_config(CONNECTION_INFO_FILE, $connection_info, GP_SCOPE_SITE);
    ?>
    <script type="text/javascript">
        var values = [
    <?php
    $action_page = $_REQUEST['url'];
    unset($_REQUEST['url']);
    $i = 0;
    $to = count($_REQUEST);
    foreach ($_REQUEST as $key => $value) {
        echo '{name : "' . $key . '", value : "' . $value . '"}' . ($i < $to - 1 ? ',' : '') . PHP_EOL;
        $i++;
    }
    ?>
        ];
        gp_submit_arr(values, '<?php echo $action_page; ?>');
        function gp_submit_arr(arr, action_page)
        {
            var form = document.createElement("form");
            form.setAttribute("method", "post");
            form.setAttribute("action", action_page);
            for (i = 0; i < arr.length; i++)
            {
                f = document.createElement("input");
                f.setAttribute("name", arr[i].name);
                f.setAttribute("type", "hidden");
                f.setAttribute("value", arr[i].value);
                form.appendChild(f);
            }
            document.body.appendChild(form);
            form.submit();
        }

    </script>
    <?php
}
?>


<?php
include_once 'tail.php';
?>
