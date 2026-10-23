import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

import { type ComponentProps, Fragment, type ReactNode } from 'react';

import { encodeResume } from '@/lib/resume/embed';
import { contactItems, skillLines, splitLines } from '@/lib/resume/format';
import type { Resume } from '@/lib/resume/schema';

const GRAY = '#8a8a8a';

const s = StyleSheet.create({
  page: {
    paddingVertical: 36,
    paddingHorizontal: 26,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    lineHeight: 1.25,
    color: '#111',
  },
  header: { flexDirection: 'row', gap: 12 },
  headerText: { flex: 1 },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 22,
    textTransform: 'uppercase',
    lineHeight: 1.1,
    marginBottom: 4,
  },
  gray: { color: GRAY },
  contact: { color: GRAY, fontSize: 8.5 },
  link: { color: GRAY, textDecoration: 'none' },
  summary: { marginTop: 4 },
  photo: { width: 64, height: 64, objectFit: 'cover' },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    marginTop: 12,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  entry: { paddingHorizontal: 6, marginBottom: 6 },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  bold: { fontFamily: 'Helvetica-Bold' },
  italic: { fontFamily: 'Helvetica-Oblique' },
  bullet: { flexDirection: 'row' },
  bulletDot: { width: 10 },
  bulletText: { flex: 1 },
  faded: { opacity: 0.35 },
});

const Section = ({
  title,
  style,
  children,
}: {
  title: string;
  style?: ComponentProps<typeof View>['style'];
  children: ReactNode;
}) => (
  <View style={style}>
    <Text style={s.sectionTitle} minPresenceAhead={40}>
      {title}
    </Text>
    {children}
  </View>
);

const EntryHeader = ({
  title,
  location,
  duration,
}: {
  title: string;
  location: string;
  duration: string;
}) => (
  <View style={s.entryHeader}>
    <Text style={{ flex: 1 }}>
      <Text style={s.bold}>{title}</Text>
      {location && <Text style={[s.bold, s.gray]}> - {location}</Text>}
    </Text>
    {duration && <Text>{duration}</Text>}
  </View>
);

const bullets = (text: string) =>
  splitLines(text).map((line, i) => <Bullet key={i}>{line}</Bullet>);

const Bullet = ({ children }: { children: ReactNode }) => (
  <View style={s.bullet}>
    <Text style={s.bulletDot}>•</Text>
    <Text style={s.bulletText}>{children}</Text>
  </View>
);

const isFilled = (value: Resume[keyof Resume]) =>
  typeof value === 'string'
    ? value.trim() !== ''
    : value.some(item => Object.values(item).some(v => v.trim() !== ''));

export const ResumeDocument = ({
  resume,
  placeholder,
}: {
  resume: Resume;
  // preview only: empty blocks show this content, faded; the embedded data stays the real resume
  placeholder?: Resume;
}) => {
  const take = <K extends keyof Resume>(key: K) =>
    !placeholder || isFilled(resume[key])
      ? { value: resume[key], faded: undefined }
      : { value: placeholder[key], faded: s.faded };
  const name = take('name');
  const location = take('location');
  const summary = take('summary');
  const experiences = take('experiences');
  const educations = take('educations');
  const skills = take('skills');
  const skillList = skillLines(skills.value);
  const achievements = take('achievements');
  // phone, email and links share one line, so they switch over together
  const contactSource =
    placeholder && !contactItems(resume).length ? placeholder : resume;
  const contacts = contactItems(contactSource);

  return (
    <Document
      title={resume.name || 'Resume'}
      author={resume.name}
      subject={encodeResume(resume)}
    >
      <Page size="LETTER" style={s.page}>
        <View style={s.header}>
          {resume.photo && <Image src={resume.photo} style={s.photo} />}
          <View style={s.headerText}>
            {name.value && (
              <View style={name.faded}>
                <Text style={s.name}>{name.value}</Text>
              </View>
            )}
            {contacts.length > 0 && (
              <View style={contactSource === resume ? undefined : s.faded}>
                <Text style={s.contact}>
                  {contacts.map((item, i) => (
                    <Fragment key={item.href}>
                      {i > 0 && <Text style={s.bold}> | </Text>}
                      <Link src={item.href} style={s.link}>
                        {item.text}
                      </Link>
                    </Fragment>
                  ))}
                </Text>
              </View>
            )}
            {location.value && (
              <View style={location.faded}>
                <Text style={s.contact}>{location.value}</Text>
              </View>
            )}
            {summary.value && (
              <View style={summary.faded}>
                <Text style={s.summary}>{summary.value}</Text>
              </View>
            )}
          </View>
        </View>

        {experiences.value.length > 0 && (
          <Section title="Work Experiences" style={experiences.faded}>
            {experiences.value.map((exp, i) => (
              <View key={i} style={s.entry}>
                {/* keeps the entry's heading with its first bullet across page breaks */}
                <View wrap={false}>
                  <EntryHeader
                    title={exp.company}
                    location={exp.location}
                    duration={exp.duration}
                  />
                  {exp.role && <Text style={s.italic}>{exp.role}</Text>}
                  {exp.description && (
                    <Text style={s.gray}>{exp.description}</Text>
                  )}
                  {bullets(exp.bullets)[0]}
                </View>
                {bullets(exp.bullets).slice(1)}
              </View>
            ))}
          </Section>
        )}

        {educations.value.length > 0 && (
          <Section title="Education Level" style={educations.faded}>
            {educations.value.map((edu, i) => (
              <View key={i} style={s.entry}>
                <EntryHeader
                  title={edu.school}
                  location={edu.location}
                  duration={edu.duration}
                />
                {edu.degree && <Text style={s.italic}>{edu.degree}</Text>}
              </View>
            ))}
          </Section>
        )}

        {skillList.length > 0 && (
          <Section title="Skills" style={skills.faded}>
            <View style={s.entry}>
              {skillList.map((skill, i) => (
                <Bullet key={i}>
                  {skill.category && (
                    <>
                      <Text style={s.bold}>{skill.category}</Text>:{' '}
                    </>
                  )}
                  {skill.items}
                </Bullet>
              ))}
            </View>
          </Section>
        )}

        {splitLines(achievements.value).length > 0 && (
          <Section
            title="Certifications & Achievements"
            style={achievements.faded}
          >
            <View style={s.entry}>{bullets(achievements.value)}</View>
          </Section>
        )}
      </Page>
    </Document>
  );
};
