import type { InvitationData } from "@/lib/invitations";

type InvitationPhotoProps = {
  data: InvitationData;
  className?: string;
};

export function InvitationPhoto({ data, className = "" }: InvitationPhotoProps) {
  if (!data.photoUrl) return null;

  const shape = data.photoShape ?? "organic";
  const frame = data.photoFrame ?? "fade";

  return (
    <div className={`invite-photo-wrap photo-shape--${shape} photo-frame--${frame} ${className}`.trim()} role="img" aria-label={`Personlig bild för ${data.name}`}>
      <div
        className="invite-photo"
        style={{
          backgroundImage: `url(${data.photoUrl})`,
          backgroundPosition: `${data.photoPositionX ?? 50}% ${data.photoPositionY ?? 50}%`,
        }}
      />
      {frame === "floral" && (
        <span className="photo-floral-frame" aria-hidden="true">
          <i>✿</i><i>✦</i><b>✿</b><b>✦</b>
        </span>
      )}
    </div>
  );
}
