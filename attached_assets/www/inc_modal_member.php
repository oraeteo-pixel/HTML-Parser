<?php if(!$is_member) { ?>
<!-- Modal -->
<div class="modal fade modal-box" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content ff-ng">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
				<h4 class="modal-title ff-ng">회원 가입</h4>
			</div>
			<div class="modal-body">
				오리알터.com은 구글계정이 있으면 별도의 회원가입 절차없이 로그인 할 수 있습니다.
<?php $loginUrls = socialLoginUrls($set_redirect=true, $redirect_url=urldecode($login_url));?>
				<br /><br />
				<a href='<?php echo $loginUrls['google']; ?>' class="btn btn-danger btn-lg" role="button"><i class="fa fa-google-plus"></i> 구글계정으로 로그인</a><br />
				<br />
				오리알터.com은 아래와 같은 이유로 <code class='ff-ng fwB'>구글에서 제공하는 소셜로그인 방식으로만</code> 회원가입을 받습니다.<br />
				<dl class="dl-horizontal">
					<dt class="Cgreen"><i class="fa fa-bolt"></i> 쉽고 빠른 로그인</dt>
					<dd class="Cgreen">
						구글계정만 있으면 아이디 만들고 비밀번호 입력하고 등등의 절차없이 버튼 클릭 한번으로 로그인이 됩니다.<br />
						<strong><u>특히 스마트폰일 경우 더욱 편의성을 느끼시리라 생각합니다.</u></strong><br />
						단 구글에 로그인이 되어 있지 않은 경우 먼저 구글계정에 로그인 과정을 거치게 됩니다.<br />
						이에 대한 주의사항은 아래에서 다시 말씀드리겠습니다.
					</dd>
					<dt class="Cblue"><i class="fa fa-lock"></i> 개인정보 보호</dt>
					<dd class="Cblue">
						오리알터.com은 이용하는데 있어서 <strong><u>구글에서 사용 중인 지메일과 닉네임, 멤버아이콘</u></strong> 외에 어떠한 개인정보도 저장되지 않습니다.<br />
						물론 닉네임도 임의의 이름으로 수정하실 수 있습니다.<br /> 멤버아이콘은 구글플러스에서 사용 중인 이미지를 그대로 
						쓰게 되므로 아이콘 설정/수정 역시 구글플러스에서 하시면 됩니다.<br />
						※ 구글플러스에서 멤버아이콘 설정하는 법에 대해선 따로 안내를 하겠습니다.
					</dd>
					<dt class="Ccrimson"><i class="fa fa-exclamation-triangle"></i> 반드시 주의하실 점</dt>
					<dd class="Ccrimson">
						구글의 소셜로그인 방식으로 오리알터.com에 로그인을 하게 되면 필연적으로 구글에 먼저 로그인이 되어 있게 됩니다.<br />
						따라서 현재 사용 중인 컴퓨터가 PC방 등의 공용PC일 경우, <strong><u>반드시 본 사이트에 로그인 직후 구글계정은 로그아웃</u></strong>을 하여야 합니다.<br />
						그렇지 않으면 뒷사람에게 귀하의 구글계정이 노출이 될 수 있기 때문입니다.<br />
						이 점은 반드시 명심하시기 바랍니다.
					</dd>
				</dl>
				위의 안내글에 동의하시면 
				<a href='<?php echo $loginUrls['google']; ?>' class="btn btn-danger btn-sm" role="button"><i class="fa fa-google-plus"></i> 구글계정으로 로그인</a>
				하시기 바랍니다. ^_^
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">창닫기</button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<?php } ?>