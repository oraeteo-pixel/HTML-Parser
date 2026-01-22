import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">이용약관</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-2">제1조 (목적)</h2>
              <p className="text-muted-foreground">
                본 약관은 오래(ORAE) 서비스(이하 "서비스")의 이용조건 및 절차, 
                회원과 서비스 제공자의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">제2조 (정의)</h2>
              <p className="text-muted-foreground">
                1. "서비스"란 오래(ORAE)가 제공하는 한국 전통 달력 및 커뮤니티 관련 모든 서비스를 말합니다.<br />
                2. "회원"이란 본 약관에 동의하고 서비스를 이용하는 자를 말합니다.<br />
                3. "아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 서비스가 승인한 문자와 숫자의 조합을 말합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">제3조 (약관의 효력 및 변경)</h2>
              <p className="text-muted-foreground">
                1. 본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.<br />
                2. 본 약관의 내용은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력을 발생합니다.<br />
                3. 서비스는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">제4조 (회원가입)</h2>
              <p className="text-muted-foreground">
                1. 서비스 이용을 원하는 자는 본 약관에 동의하고, 서비스가 정한 가입 양식에 따라 회원정보를 기입한 후 회원가입 신청을 하여야 합니다.<br />
                2. 서비스는 제1항에 따라 회원가입을 신청한 자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.<br />
                - 등록 내용에 허위, 기재누락, 오기가 있는 경우<br />
                - 기타 회원으로 등록하는 것이 서비스의 기술상 현저히 지장이 있다고 판단되는 경우
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">제5조 (개인정보의 수집 및 이용)</h2>
              <p className="text-muted-foreground">
                1. 서비스는 회원가입 시 다음의 개인정보를 수집합니다: 이름, 이메일, 전화번호<br />
                2. 수집된 개인정보는 서비스 제공 및 회원 관리 목적으로만 사용됩니다.<br />
                3. 서비스는 회원의 개인정보를 본인의 동의 없이 제3자에게 제공하지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">제6조 (회원의 의무)</h2>
              <p className="text-muted-foreground">
                1. 회원은 관계법령, 본 약관의 규정, 이용안내 및 서비스상에 공지한 주의사항을 준수하여야 합니다.<br />
                2. 회원은 서비스의 명시적 동의가 없는 한 서비스의 이용권한, 기타 이용계약상 지위를 타인에게 양도, 증여할 수 없습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">제7조 (서비스의 중단)</h2>
              <p className="text-muted-foreground">
                서비스는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 등의 사유가 발생한 경우에는 
                서비스의 제공을 일시적으로 중단할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">제8조 (면책조항)</h2>
              <p className="text-muted-foreground">
                1. 서비스는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.<br />
                2. 서비스는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">제9조 (분쟁해결)</h2>
              <p className="text-muted-foreground">
                서비스와 회원 간에 발생한 분쟁은 대한민국 법령에 따라 해결합니다.
              </p>
            </section>

            <div className="mt-8 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                본 약관은 2026년 1월 22일부터 시행됩니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
