import { BooleanBadge, ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate, PROFILES, USER_ROLES } from '@/lib/mock/dashboard';

export default function UsersPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <Section title="Kullanıcılar" description="Profil doğrulamaları ve rol atamaları.">
        <div className="grid gap-4 xl:grid-cols-2">
          <ContentCard title="Profiller" description="Auth kullanıcılarına bağlı profiller">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad Soyad</TableHead>
                  <TableHead>E-posta</TableHead>
                  <TableHead>Ev Sahibi</TableHead>
                  <TableHead>Doğrulandı</TableHead>
                  <TableHead>Kayıt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PROFILES.map((profile) => (
                  <TableRow key={profile.email}>
                    <TableCell className="font-medium">{profile.name}</TableCell>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell>
                      <BooleanBadge value={profile.isHost} />
                    </TableCell>
                    <TableCell>
                      <BooleanBadge value={profile.isVerified} />
                    </TableCell>
                    <TableCell>{formatDate(profile.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ContentCard>

          <ContentCard title="Roller" description="Yetki ve erişim seviyeleri">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Atanma</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {USER_ROLES.map((role) => (
                  <TableRow key={`${role.user}-${role.role}`}>
                    <TableCell>{role.user}</TableCell>
                    <TableCell className="capitalize">{role.role}</TableCell>
                    <TableCell>{formatDate(role.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}
