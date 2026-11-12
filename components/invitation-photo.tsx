import type { InvitationData } from "@/lib/invitations";

type InvitationPhotoProps = {
  data: InvitationData;
  templateId: string;
  className?: string;
};

const frameOrnaments: Record<string, string[]> = {
  rosendrom: ["✿", "❀", "❧", "✿", "❀", "❧"],
  appelblom: ["✤", "✿", "❦", "✤", "✿", "❦"],
  sandlofte: ["❧", "⌁", "·", "❧", "⌁", "·"],
  nattblomma: ["✦", "✧", "❦", "✦", "✧", "❦"],
  "lilla-molnet": ["✧", "⋆", "⌁", "✦", "⋆", "⌁"],
  olivkvist: ["❧", "❧", "·", "❧", "❧", "·"],
};

export function InvitationPhoto({ data, templateId, className = "" }: InvitationPhotoProps) {
  if (!data.photoUrl) return null;

  const shape = data.photoShape ?? "organic";
  const frame = data.photoFrame ?? "fade";
  const ornaments = frameOrnaments[templateId] ?? frameOrnaments.rosendrom;

  return (
    <div className={`invite-photo-wrap photo-shape--${shape} photo-frame--${frame} photo-template--${templateId} ${className}`.trim()} role="img" aria-label={`Personlig bild för ${data.name}`}>
      <div className="invite-photo-clip">
        <div
          className="invite-photo"
          style={{
            backgroundImage: `url(${data.photoUrl})`,
            backgroundPosition: `${data.photoPositionX ?? 50}% ${data.photoPositionY ?? 50}%`,
          }}
        />
      </div>
      {frame === "floral" && (
        <span className="photo-floral-frame" aria-hidden="true">
          {ornaments.map((ornament, index) => <i className={`pfo-${index + 1}`} key={`${ornament}-${index}`}>{ornament}</i>)}
        </span>
      )}
    </div>
  );
}
