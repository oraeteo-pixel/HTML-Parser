import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">개인정보처리방침</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. 개인정보의 수집 및 이용 목적</h2>
              <p className="text-muted-foreground">
                오래(ORAE)(이하 "서비스")는 다음의 목적을 위하여 개인정보를 처리합니다. 
                처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
                이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mt-2">
                <li>회원 가입 및 관리</li>
                <li>서비스 제공</li>
                <li>고객 문의 응대</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">2. 수집하는 개인정보 항목</h2>
              <p className="text-muted-foreground">
                서비스는 회원가입, 서비스 이용 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mt-2">
                <li>필수항목: 이름, 이메일, 전화번호</li>
                <li>선택항목: 프로필 사진</li>
                <li>자동수집항목: 서비스 이용기록, 접속 로그, 접속 IP 정보</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">3. 개인정보의 보유 및 이용 기간</h2>
              <p className="text-muted-foreground">
                서비스는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 
                동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.<br /><br />
                회원 탈퇴 시 즉시 파기됩니다. 다만, 관계 법령에 의해 보존해야 하는 정보는 해당 법령에서 
                정한 기간 동안 보관됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">4. 개인정보의 제3자 제공</h2>
              <p className="text-muted-foreground">
                서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 
                다만, 아래의 경우에는 예외로 합니다.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mt-2">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">5. 개인정보의 파기 절차 및 방법</h2>
              <p className="text-muted-foreground">
                서비스는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
                지체 없이 해당 개인정보를 파기합니다.<br /><br />
                전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없도록 기술적 방법을 사용하여 삭제합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">6. 이용자의 권리와 행사 방법</h2>
              <p className="text-muted-foreground">
                이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mt-2">
                <li>개인정보 열람 요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리정지 요구</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">7. 개인정보 보호책임자</h2>
              <p className="text-muted-foreground">
                서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 
                정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <p className="text-muted-foreground mt-2">
                개인정보 보호책임자: 오래(ORAE) 운영팀<br />
                이메일: contact@orae.com
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">8. 개인정보 처리방침의 변경</h2>
              <p className="text-muted-foreground">
                이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 
                삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
              </p>
            </section>

            <div className="mt-8 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                본 개인정보처리방침은 2026년 1월 22일부터 시행됩니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
