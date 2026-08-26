import type { Story } from '@ladle/react';
import { Download, Trash2 } from 'lucide-react';
import { Button } from './Button';
import type { ButtonTone, ButtonVariant } from './Button.types';

export default { title: 'Primitives / Button' };

const VARIANTS: ButtonVariant[] = ['solid', 'outline', 'subtle', 'ghost'];
const TONES: ButtonTone[] = ['brand', 'neutral', 'danger'];

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-3">
    <span className="w-20 text-sm text-fg-subtle">{label}</span>
    {children}
  </div>
);

/** variant × tone 전 조합. 정의되지 않은 조합이 있으면 여기서 바로 드러난다. */
export const Variants: Story = () => (
  <div className="flex flex-col gap-6">
    {VARIANTS.map((variant) => (
      <div key={variant} className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-fg">{variant}</h3>
        <div className="flex flex-wrap gap-3">
          {TONES.map((tone) => (
            <Button key={tone} variant={variant} tone={tone}>
              {tone}
            </Button>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const Sizes: Story = () => (
  <div className="flex flex-col gap-3">
    <Row label="sm">
      <Button size="sm">Ask a question</Button>
    </Row>
    <Row label="md">
      <Button size="md">Ask a question</Button>
    </Row>
    <Row label="lg">
      <Button size="lg">Ask a question</Button>
    </Row>
  </div>
);

export const WithIcons: Story = () => (
  <div className="flex flex-wrap gap-3">
    <Button iconStart={<Download className="size-4" />}>Download</Button>
    <Button variant="outline" tone="danger" iconStart={<Trash2 className="size-4" />}>
      Delete
    </Button>
  </div>
);

/** loading 은 disabled + aria-busy 를 함께 세팅한다(스크린리더가 이유를 알 수 있게) */
export const States: Story = () => (
  <div className="flex flex-col gap-3">
    <Row label="default">
      <Button>Submit</Button>
    </Row>
    <Row label="loading">
      <Button loading loadingLabel="Submitting">
        Submit
      </Button>
    </Row>
    <Row label="disabled">
      <Button disabled>Submit</Button>
    </Row>
    <Row label="fullWidth">
      <Button fullWidth>Submit</Button>
    </Row>
  </div>
);
