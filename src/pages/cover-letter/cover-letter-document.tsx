import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import {
  type CoverLetter,
  encodeCoverLetter,
  paragraphs,
} from '@/lib/cover-letter';

const s = StyleSheet.create({
  // same type as the resume, so the two read as a set
  page: {
    paddingVertical: 48,
    paddingHorizontal: 54,
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    lineHeight: 1.45,
    color: '#111',
  },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 22,
    textTransform: 'uppercase',
    lineHeight: 1.1,
    marginBottom: 4,
  },
  contact: { color: '#8a8a8a', fontSize: 9 },
  block: { marginTop: 20 },
  bold: { fontFamily: 'Helvetica-Bold' },
  paragraph: { marginTop: 10 },
  faded: { opacity: 0.35 },
});

export const CoverLetterDocument = ({
  letter,
  placeholder,
}: {
  letter: CoverLetter;
  // preview only: empty fields show this content, faded
  placeholder?: CoverLetter;
}) => {
  const take = (key: keyof CoverLetter) =>
    !placeholder || letter[key].trim()
      ? { value: letter[key].trim(), style: undefined }
      : { value: placeholder[key], style: s.faded };
  const name = take('name');
  const date = take('date');
  const recipient = take('recipient');
  const company = take('company');
  const role = take('role');
  const body = take('body');
  const contacts = (['location', 'email', 'phone'] as const)
    .map(take)
    .filter(item => item.value);

  return (
    <Document
      title={
        letter.company.trim()
          ? `Cover Letter - ${letter.company.trim()}`
          : 'Cover Letter'
      }
      author={letter.name}
      subject={encodeCoverLetter(letter)}
    >
      <Page size="LETTER" style={s.page}>
        {name.value && <Text style={[s.name, name.style]}>{name.value}</Text>}
        {contacts.length > 0 && (
          <Text style={s.contact}>
            {contacts.map((item, i) => (
              <Text key={i} style={item.style}>
                {i > 0 && ' | '}
                {item.value}
              </Text>
            ))}
          </Text>
        )}

        {date.value && <Text style={[s.block, date.style]}>{date.value}</Text>}

        {(recipient.value || company.value) && (
          <View style={s.block}>
            {recipient.value && (
              <Text style={recipient.style}>{recipient.value}</Text>
            )}
            {company.value && (
              <Text style={company.style}>{company.value}</Text>
            )}
          </View>
        )}

        {role.value && (
          <Text style={[s.block, s.bold, role.style]}>
            Re: Application for {role.value}
          </Text>
        )}

        <Text style={s.block}>
          Dear {letter.recipient.trim() || 'Hiring Manager'},
        </Text>
        <View style={body.style}>
          {paragraphs(body.value).map((paragraph, i) => (
            <Text key={i} style={s.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>

        <View style={s.block} wrap={false}>
          <Text>Sincerely,</Text>
          <Text style={[s.paragraph, s.bold, name.style]}>{name.value}</Text>
        </View>
      </Page>
    </Document>
  );
};
