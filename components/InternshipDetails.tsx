import { Briefcase, Clock, MapPin } from "lucide-react";
import { Internship } from "@/lib/types";
import { formatLocation, formatPostedAt, formatStipend } from "@/lib/format";

interface InternshipDetailsProps {
  internship: Internship;
}

export default function InternshipDetails({ internship }: InternshipDetailsProps) {
  return (
    <>
      <h2 className="text-xl font-semibold text-gray-900">{internship.title}</h2>
      <p className="mt-1 text-gray-600">{internship.company}</p>

      <div className="mt-4 flex flex-col gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{formatLocation(internship)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-gray-400" />
          <span>{formatStipend(internship)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>
            {internship.duration} · {formatPostedAt(internship.posted_at)}
          </span>
        </div>
      </div>

      <a
        href={internship.apply_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Apply now
      </a>

      <div className="mt-6">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Description</h3>
        <p className="text-sm leading-6 text-gray-600">{internship.description}</p>
      </div>

      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-gray-600">
        <dt className="font-medium text-gray-700">Field</dt>
        <dd>{internship.field}</dd>
        <dt className="font-medium text-gray-700">Source</dt>
        <dd>{internship.source}</dd>
      </dl>
    </>
  );
}
