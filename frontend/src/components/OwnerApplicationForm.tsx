import { FormEvent } from 'react';
import type { City } from '../types';
import { useI18n } from '../i18n';

export interface OwnerApplicationPayload {
  name: string;
  city: string;
  phone: string;
  whatsapp?: string;
  hallName?: string;
  message?: string;
}

export function OwnerApplicationForm({
  cities,
  onSubmit,
  submitLabel,
  title,
  description
}: {
  cities: City[];
  onSubmit: (payload: OwnerApplicationPayload) => Promise<void> | void;
  submitLabel?: string;
  title?: string;
  description?: string;
}) {
  const { t, loc } = useI18n();
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    await onSubmit({
      name: String(data.get('name') ?? ''),
      city: String(data.get('city') ?? ''),
      phone: String(data.get('phone') ?? ''),
      whatsapp: String(data.get('whatsapp') ?? ''),
      hallName: String(data.get('hallName') ?? ''),
      message: String(data.get('message') ?? '')
    });
    form.reset();
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[1.75rem] bg-card p-6 shadow-soft">
      <div>
        <h3 className="font-serif text-2xl">{title ?? t('owner.page.formTitle')}</h3>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      <input name="name" required placeholder={t('ownerForm.name')} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <select name="city" required defaultValue="" className="w-full rounded-2xl border border-slate-200 px-4 py-3">
        <option value="" disabled>
          {t('ownerForm.selectCity')}
        </option>
        {cities.map((city) => (
          <option key={city.id} value={city.nameRu}>
            {loc(city.nameRu, city.nameKk)}
          </option>
        ))}
      </select>
      <input name="hallName" placeholder={t('ownerForm.hallName')} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <input name="phone" required placeholder={t('ownerForm.phone')} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <input name="whatsapp" placeholder={t('ownerForm.whatsapp')} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <textarea
        name="message"
        rows={4}
        placeholder={t('ownerForm.message')}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3"
      />
      <button type="submit" className="rounded-full bg-primary px-5 py-3 font-semibold text-white">
        {submitLabel ?? t('ownerForm.submit')}
      </button>
    </form>
  );
}
