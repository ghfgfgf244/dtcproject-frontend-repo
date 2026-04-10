import { redirect } from 'next/navigation';

export default function CommissionsRedirectPage() {
  redirect('/enrollment-manager/collaborators');
}