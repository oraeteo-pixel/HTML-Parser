import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Mail, Send, Inbox, Check, Loader2, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useLocation, useSearch } from "wouter";

type ReceivedMessage = {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: number | null;
  createdAt: string | null;
  senderName: string;
  senderEmail: string | null;
};

type SentMessage = {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: number | null;
  createdAt: string | null;
  receiverName: string;
  receiverEmail: string | null;
};

export default function Messages() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const toUserId = params.get("to");
  const toUserName = params.get("name");
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(toUserId ? "compose" : "received");
  const [replyTo, setReplyTo] = useState<ReceivedMessage | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [composeReceiverId, setComposeReceiverId] = useState(toUserId || "");
  const [composeReceiverName, setComposeReceiverName] = useState(toUserName || "");
  const [composeContent, setComposeContent] = useState("");

  const { data: receivedMessages, isLoading: receivedLoading } = useQuery<ReceivedMessage[]>({
    queryKey: ["/api/messages/received"],
    enabled: isAuthenticated,
  });

  const { data: sentMessages, isLoading: sentLoading } = useQuery<SentMessage[]>({
    queryKey: ["/api/messages/sent"],
    enabled: isAuthenticated,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      await apiRequest("POST", `/api/messages/${messageId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/received"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/unread-count"] });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ receiverId, content }: { receiverId: string; content: string }) => {
      await apiRequest("POST", "/api/messages", { receiverId, content });
    },
    onSuccess: () => {
      toast({ title: "쪽지를 보냈습니다." });
      setReplyTo(null);
      setReplyContent("");
      setComposeReceiverId("");
      setComposeReceiverName("");
      setComposeContent("");
      setActiveTab("sent");
      setLocation("/messages");
      queryClient.invalidateQueries({ queryKey: ["/api/messages/sent"] });
    },
    onError: (error: any) => {
      toast({ title: "오류", description: error.message || "쪽지 전송에 실패했습니다.", variant: "destructive" });
    },
  });

  const handleCompose = () => {
    if (!composeReceiverId || !composeContent.trim()) return;
    sendMessageMutation.mutate({ receiverId: composeReceiverId, content: composeContent });
  };

  const handleMarkAsRead = (msg: ReceivedMessage) => {
    if (!msg.isRead) {
      markAsReadMutation.mutate(msg.id);
    }
  };

  const handleReply = () => {
    if (!replyTo || !replyContent.trim()) return;
    sendMessageMutation.mutate({ receiverId: replyTo.senderId, content: replyContent });
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-[990px] mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="mb-4">쪽지함을 사용하려면 로그인하세요.</p>
          <Button onClick={() => window.location.href = "/api/login"} data-testid="button-login-messages">
            로그인
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[990px] mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-home">
          <Home className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold" style={{ fontFamily: "'Malgun Gothic', sans-serif" }}>쪽지함</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="received" data-testid="tab-received">
            <Inbox className="h-4 w-4 mr-2" />
            받은 쪽지
          </TabsTrigger>
          <TabsTrigger value="sent" data-testid="tab-sent">
            <Send className="h-4 w-4 mr-2" />
            보낸 쪽지
          </TabsTrigger>
          {composeReceiverName && (
            <TabsTrigger value="compose" data-testid="tab-compose">
              <Mail className="h-4 w-4 mr-2" />
              쪽지 쓰기
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="received">
          {receivedLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : receivedMessages?.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              받은 쪽지가 없습니다.
            </Card>
          ) : (
            <div className="space-y-2">
              {receivedMessages?.map((msg) => (
                <Card
                  key={msg.id}
                  className={`p-3 cursor-pointer hover-elevate ${!msg.isRead ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' : ''}`}
                  onClick={() => handleMarkAsRead(msg)}
                  data-testid={`message-received-${msg.id}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{msg.senderName}</span>
                      {!msg.isRead && (
                        <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">새 쪽지</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {msg.createdAt && format(new Date(msg.createdAt), "M월 d일 HH:mm", { locale: ko })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  
                  {replyTo?.id === msg.id ? (
                    <div className="mt-3 pt-3 border-t" onClick={(e) => e.stopPropagation()}>
                      <Textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="답장 내용을 입력하세요..."
                        className="mb-2 min-h-[80px]"
                        data-testid="textarea-reply"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)} data-testid="button-cancel-reply">
                          취소
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleReply}
                          disabled={!replyContent.trim() || sendMessageMutation.isPending}
                          data-testid="button-send-reply"
                        >
                          {sendMessageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
                          보내기
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 flex justify-end" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => { setReplyTo(msg); setReplyContent(""); }} data-testid={`button-reply-${msg.id}`}>
                        답장
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent">
          {sentLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : sentMessages?.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              보낸 쪽지가 없습니다.
            </Card>
          ) : (
            <div className="space-y-2">
              {sentMessages?.map((msg) => (
                <Card key={msg.id} className="p-3" data-testid={`message-sent-${msg.id}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">받는 사람:</span>
                      <span className="font-medium text-sm">{msg.receiverName}</span>
                      {msg.isRead ? (
                        <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-0.5">
                          <Check className="h-3 w-3" /> 읽음
                        </span>
                      ) : null}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {msg.createdAt && format(new Date(msg.createdAt), "M월 d일 HH:mm", { locale: ko })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="compose">
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">받는 사람</label>
                <Input
                  value={composeReceiverName}
                  disabled
                  className="bg-muted"
                  data-testid="input-receiver-name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">내용</label>
                <Textarea
                  value={composeContent}
                  onChange={(e) => setComposeContent(e.target.value)}
                  placeholder="쪽지 내용을 입력하세요..."
                  className="min-h-[120px]"
                  data-testid="textarea-compose"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleCompose}
                  disabled={!composeContent.trim() || sendMessageMutation.isPending}
                  data-testid="button-send-compose"
                >
                  {sendMessageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
                  쪽지 보내기
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
