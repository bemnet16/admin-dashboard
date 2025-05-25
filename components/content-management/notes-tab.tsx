import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { moderatorNotes } from "@/lib/moderator-notes";
import { formatDateTime } from "./utils";

export function NotesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Moderator Notes</h3>
        <Button variant="outline" size="sm" className="text-xs">
          Add Note
        </Button>
      </div>

      <div className="space-y-3">
        {moderatorNotes.map((note) => (
          <div key={note.id} className="p-3 border rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{note.moderator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">{note.moderator.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(note.createdAt)}
              </span>
            </div>
            <p className="text-sm">{note.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
