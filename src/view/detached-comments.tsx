import { MessageSquare, X } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWsStore } from "@/store/ws";
import { LiveComments } from "@/view/live-comments";

interface DetachedCommentsProps {
  detached: boolean;
  onDetach: () => void;
  onDock: () => void;
}

export function DetachedComments({
  detached,
  onDetach,
  onDock,
}: DetachedCommentsProps) {
  const connected = useWsStore((state) => state.connected);
  const messageCount = useWsStore(
    (state) => state.regularMessages.length + state.superChats.length,
  );

  const showComments = async () => {
    const commentsWindow = await WebviewWindow.getByLabel("comments");
    if (commentsWindow) {
      await commentsWindow.show();
      await commentsWindow.setFocus();
      onDetach();
    }
  };

  const dockComments = async () => {
    const commentsWindow = await WebviewWindow.getByLabel("comments");
    if (commentsWindow) {
      await commentsWindow.hide();
    }
    onDock();
  };

  if (!detached) {
    return <LiveComments onDetach={showComments} />;
  }

  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center gap-5 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <HugeiconsIcon icon={MessageSquare} className="size-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">弹幕已拆分为悬浮窗</h2>
        <div className="flex items-center justify-center gap-2">
          <Badge variant={connected ? "default" : "secondary"}>
            {connected ? "已连接" : "等待连接"}
          </Badge>
          <Badge variant="outline">{messageCount} 条消息</Badge>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={showComments}>
          <HugeiconsIcon icon={MessageSquare} />
          显示弹幕悬浮窗
        </Button>
        <Button variant="outline" onClick={dockComments}>
          <HugeiconsIcon icon={X} />
          关闭悬浮窗
        </Button>
      </div>
    </div>
  );
}
