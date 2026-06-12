import { FormEvent } from 'react';
import type { City } from '../types';

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
  submitLabel = 'Отправить заявку',
  title = 'Оставьте заявку',
  description
}: {
  cities: City[];
  onSubmit: (payload: OwnerApplicationPayload) => Promise<void> | void;
  submitLabel?: string;
  title?: string;
  description?: string;
}) {
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
        <h3 className="font-serif text-2xl">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      <input name="name" required placeholder="Ваше имя" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <select name="city" required defaultValue="" className="w-full rounded-2xl border border-slate-200 px-4 py-3">
        <option value="" disabled>
          Выберите город
        </option>
        {cities.map((city) => (
          <option key={city.id} value={city.nameRu}>
            {city.nameRu}
          </option>
        ))}
      </select>
      <input name="hallName" placeholder="Название зала" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <input name="phone" required placeholder="Телефон" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <input name="whatsapp" placeholder="WhatsApp" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <textarea
        name="message"
        rows={4}
        placeholder="Коротко расскажите о зале или задаче"
        className="w-full rounded-2xl border border-slate-200 px-4 py-3"
      />
      <button type="submit" className="rounded-full bg-primary px-5 py-3 font-semibold text-white">
        {submitLabel}
      </button>
    </form>
  );
}
