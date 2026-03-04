interface Props {
  user: any;
}

export default function StudentDetail({ user }: Props) {
  return (
    <div>
      <p><strong>Phone number:</strong> 0987654321</p>
      <p><strong>Date of birth:</strong> 01/02/2003</p>
      <p><strong>Address:</strong> 01 Mixue Hoa Hai Da Nang</p>
      <p><strong>Class:</strong> A2</p>
    </div>
  );
}