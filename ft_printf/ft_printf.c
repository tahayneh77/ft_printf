/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_printf.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtahayne <mtahayne@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/10/08 14:40:00 by mtahayne          #+#    #+#             */
/*   Updated: 2026/10/08 14:40:00 by mtahayne         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ft_printf.h"

static int	ft_handle_format(char specifier, va_list *args)
{
	int	count;

	count = 0;
	if (specifier == 'c')
		count = ft_print_char(va_arg(*args, int));
	else if (specifier == 's')
		count = ft_print_str(va_arg(*args, char *));
	else if (specifier == 'p')
		count = ft_print_ptr(va_arg(*args, void *));
	else if (specifier == 'd' || specifier == 'i')
		count = ft_print_nbr(va_arg(*args, int));
	else if (specifier == 'u')
		count = ft_print_unsigned(va_arg(*args, unsigned int));
	else if (specifier == 'x' || specifier == 'X')
		count = ft_print_hex(va_arg(*args, unsigned int), specifier);
	else if (specifier == '%')
		count = ft_print_char('%');
	return (count);
}

int	ft_printf(const char *format, ...)
{
	va_list	args;
	int		count;
	int		i;
	int		res;

	if (!format)
		return (-1);
	va_start(args, format);
	count = 0;
	i = 0;
	while (format[i])
	{
		if (format[i] == '%' && format[i + 1])
		{
			res = ft_handle_format(format[i + 1], &args);
			if (res == -1)
				return (-1);
			count += res;
			i += 2;
		}
		else if (format[i] != '%')
		{
			if (ft_print_char(format[i++]) == -1)
				return (-1);
			count++;
		}
		else
			i++;
	}
	va_end(args);
	return (count);
}
