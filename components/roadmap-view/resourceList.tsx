type ResourceItemProps = {
  resource: string;
};

type ResourceListProps = {
  resources: string[];
  accentTextClass: string;
};

function ResourceItem({ resource }: ResourceItemProps) {
  let hostname = resource;
  let isUrl = false;

  try {
    const parsed = new URL(resource);
    hostname = parsed.hostname.replace('www.', '');
    isUrl = true;
  } catch {}

  return (
    <li className="flex items-start gap-2 text-xs text-neutral-500">
      <span className="mt-0.5 text-neutral-700">–</span>
      {isUrl ? (
        <a
          href={resource}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-neutral-700 underline-offset-2 transition-colors hover:text-neutral-300 hover:decoration-neutral-400"
        >
          {hostname}
        </a>
      ) : (
        <span>{resource}</span>
      )}
    </li>
  );
}

export function ResourceList({ resources, accentTextClass }: ResourceListProps) {
  return (
    <div className="mt-auto border-t border-neutral-800 pt-4">
      <p className={`mb-2 text-xs font-semibold uppercase tracking-widest ${accentTextClass}`}>
        Resources
      </p>
      <ul className="flex flex-col gap-1">
        {resources.map((resource, index) => (
          <ResourceItem key={`${resource}-${index}`} resource={resource} />
        ))}
      </ul>
    </div>
  );
}
