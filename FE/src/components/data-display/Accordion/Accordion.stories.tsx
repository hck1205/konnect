import type { Story } from '@ladle/react';
import { Accordion, AccordionItem } from './Accordion';

export default { title: 'Data display / Accordion' };

/**
 * 같은 `name` 을 주면 **하나만 열린다**. 브라우저가 처리하므로 상태 관리 JS 가 없다.
 * 열어 두고 Ctrl+F 로 접힌 내용을 검색해 보면 브라우저가 자동으로 펼쳐 준다.
 */
export const Exclusive: Story = () => (
  <div className="max-w-xl">
    <Accordion>
      <AccordionItem name="faq" summary="What do I need before I arrive?" defaultOpen>
        Passport, visa, and your certificate of admission. Bring more copies than you
        think you need.
      </AccordionItem>
      <AccordionItem name="faq" summary="When should I register as a foreign resident?">
        Check the current deadline with your local immigration office — it changes and
        depends on your status of stay.
      </AccordionItem>
      <AccordionItem name="faq" summary="Can I open a bank account without an ARC?">
        It depends on the bank and the branch. Members here report very different
        experiences.
      </AccordionItem>
    </Accordion>
  </div>
);

/** `name` 을 주지 않으면 여러 개를 동시에 열 수 있다 */
export const Independent: Story = () => (
  <div className="max-w-xl">
    <Accordion>
      <AccordionItem summary="Section one">Opens independently.</AccordionItem>
      <AccordionItem summary="Section two">So does this one.</AccordionItem>
    </Accordion>
  </div>
);
