import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, Inbox, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

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

interface MessagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MessagesDialog({ open, onOpenChange }: MessagesDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("received");
  const [replyTo, setReplyTo] = useState<ReceivedMessage | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const { data: receivedMessages, isLoading: receivedLoading } = useQuery<ReceivedMessage[]>({
    queryKey: ["/api/messages/received"],
    enabled: open,
  });

  const { data: sentMessages, isLoading: sentLoading } = useQuery<SentMessage[]>({
    queryKey: ["/api/messages/sent"],
    enabled: open,
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
      setActiveTab("sent");
      queryClient.invalidateQueries({ queryKey: ["/api/messages/sent"] });
    },
    onError: (error: any) => {
      toast({ title: "오류", description: error.message || "쪽지 전송에 실패했습니다.", variant: "destructive" });
    },
  });

  const handleMarkAsRead = (msg: ReceivedMessage) => {
    if (!msg.isRead) {
      markAsReadMutation.mutate(msg.id);
    }
  };

  const handleReply = () => {
    if (!replyTo || !replyContent.trim()) return;
    sendMessageMutation.mutate({ receiverId: replyTo.senderId, content: replyContent });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            쪽지함
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="mb-2">
            <TabsTrigger value="received" data-testid="dialog-tab-received">
              <Inbox className="h-4 w-4 mr-1" />
              받은 쪽지
            </TabsTrigger>
            <TabsTrigger value="sent" data-testid="dialog-tab-sent">
              <Send className="h-4 w-4 mr-1" />
              보낸 쪽지
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="received" className="mt-0">
              {receivedLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : receivedMessages?.length === 0 ? (
                <Card className="p-4 text-center text-muted-foreground text-sm">
                  받은 쪽지가 없습니다.
                </Card>
              ) : (
                <div className="space-y-2">
                  {receivedMessages?.map((msg) => (
                    <Card
                      key={msg.id}
                      className={`p-2.5 cursor-pointer hover-elevate ${!msg.isRead ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' : ''}`}
                      onClick={() => handleMarkAsRead(msg)}
                      data-testid={`dialog-message-received-${msg.id}`}
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
                        <div className="mt-2 pt-2 border-t" onClick={(e) => e.stopPropagation()}>
                          <Textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="답장 내용을 입력하세요..."
                            className="mb-2 min-h-[60px] text-sm"
                            data-testid="dialog-textarea-reply"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)} data-testid="dialog-button-cancel-reply">
                              취소
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleReply}
                              disabled={!replyContent.trim() || sendMessageMutation.isPending}
                              data-testid="dialog-button-send-reply"
                            >
                              {sendMessageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
                              보내기
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 flex justify-end" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setReplyTo(msg); setReplyContent(""); }} data-testid={`dialog-button-reply-${msg.id}`}>
                            답장
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sent" className="mt-0">
              {sentLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : sentMessages?.length === 0 ? (
                <Card className="p-4 text-center text-muted-foreground text-sm">
                  보낸 쪽지가 없습니다.
                </Card>
              ) : (
                <div className="space-y-2">
                  {sentMessages?.map((msg) => (
                    <Card key={msg.id} className="p-2.5" data-testid={`dialog-message-sent-${msg.id}`}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">받는 사람:</span>
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
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
